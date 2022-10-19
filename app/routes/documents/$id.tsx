import type { LoaderArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { lazy, Suspense } from "react";
import { ClientOnly } from "remix-utils";

const Preview = lazy(() => import("~/features/preview"));
const SignatureModel = lazy(() => import("~/features/signature-modal"));

export function loader({ params }: LoaderArgs) {
  invariant(params.id);
  return params.id;
}

function Route() {
  const id = useLoaderData<typeof loader>();
  return (
    <>
      <main className="flex">
        <div className="flex-[1] border p-4">
          <menu>
            <li>
              <Suspense>
                <SignatureModel />
              </Suspense>
            </li>
          </menu>
        </div>
        <div className="flex-[5] border">
          <ClientOnly>
            {() => (
              <Suspense>
                <Preview className="mx-auto max-w-screen-lg" file={id} />
              </Suspense>
            )}
          </ClientOnly>
        </div>
      </main>
    </>
  );
}

export default Route;
