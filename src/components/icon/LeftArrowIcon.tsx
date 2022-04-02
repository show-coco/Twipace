import { VFC } from "react";

type Props = {
  className?: string;
};

export const ArrowLeftIcon: VFC<Props> = ({ className }: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
    </svg>
  );
};
