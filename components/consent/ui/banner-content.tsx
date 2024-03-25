import Link from "next/link";

/**
 * Responsible for rendering the content inside the banner shell
 * takes in 4 key static props: {heading, description, href, label}
 *
 * @export
 * @param {BannerContentProps} React.PropsWithChildren<{
 *   heading?: string, description?: string, href?: string, label?: string
 * }>
 * @return {*} {React.ReactNode}
 */
export function BannerContent(props: BannerContentProps) {
  return (
    <div className="flex flex-col justify-center gap-y-2 mr-2 flex-1 text-sm">
      <strong>{props.heading ?? "Transparency"}</strong>
      <p className="">
        {props.description ?? "We use cookies to improve your experience."} By
        using our site, you agree to our{" "}
        <Link
          href={props.href ?? "/privacy"}
          className="text-primary-500 dark:text-primary-400 hover:underline text-gray-500"
        >
          {props.label ?? "privacy policy"}
        </Link>
        .
      </p>
    </div>
  );
}