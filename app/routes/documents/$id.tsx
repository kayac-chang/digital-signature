import type { LoaderArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { lazy, Suspense, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ClientOnly } from "remix-utils";
import { createImage } from "~/utils/image";
const Preview = lazy(() => import("~/features/preview"));
// const CreateSignature = lazy(() => import("~/features/create-signature"));
const SelectSignature = lazy(() => import("~/features/select-signature"));

const trigger = "flex w-full border py-2 px-4";
const overlay = "fixed inset-0 bg-slate-500/50";
const content = "fixed inset-0 grid place-content-center";

type ModelProps = {
  onSelected?: (selected: string) => void;
};
function Model(props: ModelProps) {
  const [open, setOpen] = useState(false);
  function onSelected(selected: string) {
    props.onSelected?.(selected);
    setOpen(false);
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={trigger}>Signature</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={overlay} />;
        <Dialog.Content className={content}>
          <SelectSignature onSubmit={onSelected} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function loader({ params }: LoaderArgs) {
  invariant(params.id);
  return params.id;
}

function Route() {
  const id = useLoaderData<typeof loader>();
  const [selectedSignature, setSelectedSignature] = useState<string>();

  async function onPointerStart(
    render: (image: HTMLImageElement) => Promise<void> | void
  ) {
    if (!selectedSignature) return;
    render(await createImage(selectedSignature));
    setSelectedSignature(undefined);
  }

  return (
    <ClientOnly>
      {() => (
        <main className="flex">
          <div className="flex-[1] border p-4">
            <menu>
              <li>
                <Suspense>
                  <Model onSelected={setSelectedSignature} />
                </Suspense>
              </li>
            </menu>
          </div>
          <div className="flex-[5] border">
            <Suspense>
              <Preview
                className="mx-auto max-w-screen-lg"
                file={id}
                onPointerStart={onPointerStart}
              />
            </Suspense>
          </div>
        </main>
      )}
    </ClientOnly>
  );
}

export default Route;
