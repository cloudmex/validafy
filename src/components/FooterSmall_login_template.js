import React from "react";

export default function FooterSmall(props) {
  return (
    <>
      <footer
        className={
          (props.absolute
            ? "absolute w-full bottom-0 bg-gray-900"
            : "relative") + " pb-6"
        }
      >
        <div className="container mx-auto px-4">
          <hr className="mb-6 border-b-1 border-gray-700" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 ">
              <div className="text-sm text-right text-gray-100  py-1">
                Copyright © {new Date().getFullYear()} Validafy by
                <a
                  href="https://cloudmex.io/"
                  className="text-gray-600 hover:text-red-300"
                >
                  CloudMex Analytics.
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
