declare type $ElementProps<T> = T extends React.ComponentType<infer Props>
  ? Props extends object
    ? Props
    : never
  : never;

declare type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

declare type FormValidationErrors<T> = {
  [K in keyof T]?: string;
};
