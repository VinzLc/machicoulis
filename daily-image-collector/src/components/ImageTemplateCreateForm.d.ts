/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ImageTemplateCreateFormInputValues = {
    name?: string;
    rarity?: string;
    category?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
export declare type ImageTemplateCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    rarity?: ValidationFunction<string>;
    category?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    imageUrl?: ValidationFunction<string>;
    isActive?: ValidationFunction<boolean>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ImageTemplateCreateFormOverridesProps = {
    ImageTemplateCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    rarity?: PrimitiveOverrideProps<TextFieldProps>;
    category?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    imageUrl?: PrimitiveOverrideProps<TextFieldProps>;
    isActive?: PrimitiveOverrideProps<SwitchFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ImageTemplateCreateFormProps = React.PropsWithChildren<{
    overrides?: ImageTemplateCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ImageTemplateCreateFormInputValues) => ImageTemplateCreateFormInputValues;
    onSuccess?: (fields: ImageTemplateCreateFormInputValues) => void;
    onError?: (fields: ImageTemplateCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ImageTemplateCreateFormInputValues) => ImageTemplateCreateFormInputValues;
    onValidate?: ImageTemplateCreateFormValidationValues;
} & React.CSSProperties>;
export default function ImageTemplateCreateForm(props: ImageTemplateCreateFormProps): React.ReactElement;
