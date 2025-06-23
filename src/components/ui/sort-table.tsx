import React, { ReactNode, JSX } from "react";
import { TiArrowUnsorted, TiArrowSortedDown, TiArrowSortedUp} from "react-icons/ti";

// we support { ..., order: "" } or a string for order
interface IProps<T> {
  title?: string;
  order: T;
  setOrder: (order: T) => void;
  fieldName: string;
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
}

const SortTable = <T extends ReactNode>({
  title,
  order,
  fieldName,
  setOrder,
  children,
  justifyContent = "flex-start",
}: IProps<T> & { children?: ReactNode }): JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: justifyContent,
        alignItems: "center",
        gap: "3px",
        cursor: "pointer",
      }}
      onClick={() => {
        if (typeof order == "string") {
          (setOrder as (order: string) => void)(
            order === `${fieldName} ASC` ? `${fieldName} DESC` : `${fieldName} ASC`
          );
        } else {
          setOrder({
            ...(order as any),
            order: (order as any).order === `${fieldName} ASC` ? `${fieldName} DESC` : `${fieldName} ASC`,
          });
        }
      }}
    >
      {title ? title : children}

      {typeof order == "string" ? (
        order === `${fieldName} ASC` ? (
          <TiArrowSortedDown size={14} />
        ) : order === `${fieldName} DESC` ? (
          <TiArrowSortedUp size={14} />
        ) : (
          <TiArrowUnsorted size={14} />
        )
      ) : (order as any).order === `${fieldName} ASC` ? (
        <TiArrowSortedDown size={14} />
      ) : (order as any).order === `${fieldName} DESC` ? (
        <TiArrowSortedUp size={14} />
      ) : (
        <TiArrowUnsorted size={14} />
      )}
    </div>
  );
};
export default SortTable;
