import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { Cookie } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

type BannerProps = React.PropsWithChildren<
  {
    bannerClass?: string;
    asChild?: boolean;
    buttonGroup?: React.ReactNode;
    leftElement?: React.ReactNode;
  } & BannerContentProps
>;

const background =
  "bg-muted/20 py-4 px-6 rounded-lg shadow-lg flex items-center justify-between gap-x-4 backdrop-blur-md";

export default function Banner(props: BannerProps) {
  const { asChild, leftElement, buttonGroup, bannerClass, ...rest } = props;

  const ContentSlot = asChild ? Slot : BannerContent;
  const btnGroup = buttonGroup ? buttonGroup : <BannerTriggerGroup />;
  const lefty = leftElement ? leftElement : <Cookie className="w-8 h-8" />;

  return (
    <div className="fixed inset-x-0 bottom-10 max-w-3xl z-10 mx-auto">
      <div className={cn(background, bannerClass)}>
        {lefty}
        <ContentSlot {...rest}>{props.children}</ContentSlot>
        {btnGroup}
      </div>
    </div>
  );
}

type BannerContentProps = React.PropsWithChildren<{
  heading?: string;
  description?: string;
  href?: string;
  label?: string;
}>;

function BannerContent(props: BannerContentProps) {
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

type ButtonGroupProps = React.PropsWithChildren<
  {
    asChild?: boolean;
  } & BannerTriggersProps
>;

export function BannerTriggerGroup(props: ButtonGroupProps) {
  const ButtonGroupSlot = props.asChild ? Slot : BannerTriggers;
  return (
    <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2">
      <ButtonGroupSlot {...props}>{props.children}</ButtonGroupSlot>
    </div>
  );
}

type BannerTriggersProps = {
  buttons?: ButtonProps[];
  asChild?: boolean;
};
const _buttons: BannerTriggersProps["buttons"] = [
  { children: "Show Me", variant: "outline", type: "button", size: "sm" },
  { children: "Got it", variant: "default", type: "submit", size: "sm" },
];

const isPro = !!(process.env.NEXT_PUBLIC_FEATURE_PRO === "true");

function BannerTriggers(props: React.PropsWithChildren<BannerTriggersProps>) {
  const { asChild, buttons, children, ...rest } = props;

  let btns = buttons ?? _buttons;
  if (btns && btns.length > 2) {
    btns.length = 2; // removes all buttons after the 2nd
    console.log(btns);
    console.warn("BannerTriggers: Only 2 buttons are supported");
  }

  return asChild ? (
    <Slot>{children}</Slot>
  ) : (
    <>
      {btns
        ? btns.map((btn, i) => {
            if (isPro && i === 0) {
              // add popover around this button
              // if this is going to be a pro feature, then we can add a prop to the button
              return <ShowMeButton key={i} {...btn} />;
            }
            return <Button key={i} {...btn} {...rest} />;
          })
        : null}
    </>
  );
}

function ShowMeButton({ btn, ...rest }: { btn?: ButtonProps }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button {...btn} {...rest} />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        className={cn("relative ", background, "w-full")}
      >
        <div className="absolute rotate-[270deg] -left-[2.2rem] pt-3 top-[3.3rem] opacity-90 z-0 drop-shadow-md">
          <p>Transparency</p>
        </div>
        <BannerOptions options={defaultOptions} />
      </PopoverContent>
    </Popover>
  );
}

type CookieOption = {
  label: string;
  description: string;
}

const defaultOptions:CookieOption[] = [
  {
    label: "Necessary",
    description: "Cookies necessary for website functionality.",
  },
  {
    label: "Performance",
    description: "Cookies for measuring and improving site performance.",
  },
  {
    label: "Functional",
    description: "Cookies for enhanced functionality and personalization.",
  },
  {
    label: "Targeting",
    description: "Cookies for targeted advertising based on interests.",
  },
];

function BannerOptions({ options }: { options: CookieOption[] }) {
  return (
    <div className="grid gap-4 p-2 min-w-2xl bg-background/40 backdrop-blur-md rounded-md z-10">
      {options?.length
        ? options.map((option, i) => {
            const isDisabled = i === 0;
            return (
              <Option
                key={option.label}
                {...option}
                disabled={isDisabled}
                className="disabled:opacity-40 disabled:hover:opacity-20"
              />
            );
          })
        : null}
    </div>
  );
}

function Option({
  label,
  description,
  disabled,
  className,
}: {
  label: string;
  description: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className="pl-1 py-1 flex items-center space-x-4 pt-2 [&:not(:first-child)]:border-t">
      <Switch
        id={label}
        className={cn(
          "data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-gray-500",
          className
        )}
        thumb={{
          className:
            "data-[state=checked]:bg-gray-300 data-[state=unchecked]:bg-gray-400",
        }}
        disabled={disabled}
      />
      <div>
        <Label htmlFor={label} className="text-sm leading-5">
          {label}
        </Label>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}
