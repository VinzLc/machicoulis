/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type DailyClaimCreateFormInputValues = {
    userID?: string;
    claimDate?: string;
    imageID?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type DailyClaimCreateFormValidationValues = {
    userID?: ValidationFunction<string>;
    claimDate?: ValidationFunction<string>;
    imageID?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type DailyClaimCreateFormOverridesProps = {
    DailyClaimCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userID?: PrimitiveOverrideProps<TextFieldProps>;
    claimDate?: PrimitiveOverrideProps<TextFieldProps>;
    imageID?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type DailyClaimCreateFormProps = React.PropsWithChildren<{
    overrides?: DailyClaimCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: DailyClaimCreateFormInputValues) => DailyClaimCreateFormInputValues;
    onSuccess?: (fields: DailyClaimCreateFormInputValues) => void;
    onError?: (fields: DailyClaimCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: DailyClaimCreateFormInputValues) => DailyClaimCreateFormInputValues;
    onValidate?: DailyClaimCreateFormValidationValues;
} & React.CSSProperties>;
export default function DailyClaimCreateForm(props: DailyClaimCreateFormProps): React.ReactElement;
