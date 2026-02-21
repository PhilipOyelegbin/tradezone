import { Link } from "react-router-dom";

const Error: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-[#E25822]">404</p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>

        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        <Link
          to="/"
          className="mt-10 inline-block rounded-md bg-[#E25822] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#B84016] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#B84016] transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default Error;
