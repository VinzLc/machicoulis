/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getDailyClaim } from "../graphql/queries";
import { updateDailyClaim } from "../graphql/mutations";
const client = generateClient();
export default function DailyClaimUpdateForm(props) {
  const {
    id: idProp,
    dailyClaim: dailyClaimModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    userID: "",
    claimDate: "",
    imageID: "",
    createdAt: "",
    updatedAt: "",
  };
  const [userID, setUserID] = React.useState(initialValues.userID);
  const [claimDate, setClaimDate] = React.useState(initialValues.claimDate);
  const [imageID, setImageID] = React.useState(initialValues.imageID);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [updatedAt, setUpdatedAt] = React.useState(initialValues.updatedAt);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = dailyClaimRecord
      ? { ...initialValues, ...dailyClaimRecord }
      : initialValues;
    setUserID(cleanValues.userID);
    setClaimDate(cleanValues.claimDate);
    setImageID(cleanValues.imageID);
    setCreatedAt(cleanValues.createdAt);
    setUpdatedAt(cleanValues.updatedAt);
    setErrors({});
  };
  const [dailyClaimRecord, setDailyClaimRecord] =
    React.useState(dailyClaimModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getDailyClaim.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getDailyClaim
        : dailyClaimModelProp;
      setDailyClaimRecord(record);
    };
    queryData();
  }, [idProp, dailyClaimModelProp]);
  React.useEffect(resetStateValues, [dailyClaimRecord]);
  const validations = {
    userID: [{ type: "Required" }],
    claimDate: [{ type: "Required" }],
    imageID: [{ type: "Required" }],
    createdAt: [{ type: "Required" }],
    updatedAt: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          userID,
          claimDate,
          imageID,
          createdAt,
          updatedAt,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateDailyClaim.replaceAll("__typename", ""),
            variables: {
              input: {
                id: dailyClaimRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "DailyClaimUpdateForm")}
      {...rest}
    >
      <TextField
        label="User id"
        isRequired={true}
        isReadOnly={false}
        value={userID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userID: value,
              claimDate,
              imageID,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.userID ?? value;
          }
          if (errors.userID?.hasError) {
            runValidationTasks("userID", value);
          }
          setUserID(value);
        }}
        onBlur={() => runValidationTasks("userID", userID)}
        errorMessage={errors.userID?.errorMessage}
        hasError={errors.userID?.hasError}
        {...getOverrideProps(overrides, "userID")}
      ></TextField>
      <TextField
        label="Claim date"
        isRequired={true}
        isReadOnly={false}
        value={claimDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userID,
              claimDate: value,
              imageID,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.claimDate ?? value;
          }
          if (errors.claimDate?.hasError) {
            runValidationTasks("claimDate", value);
          }
          setClaimDate(value);
        }}
        onBlur={() => runValidationTasks("claimDate", claimDate)}
        errorMessage={errors.claimDate?.errorMessage}
        hasError={errors.claimDate?.hasError}
        {...getOverrideProps(overrides, "claimDate")}
      ></TextField>
      <TextField
        label="Image id"
        isRequired={true}
        isReadOnly={false}
        value={imageID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userID,
              claimDate,
              imageID: value,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.imageID ?? value;
          }
          if (errors.imageID?.hasError) {
            runValidationTasks("imageID", value);
          }
          setImageID(value);
        }}
        onBlur={() => runValidationTasks("imageID", imageID)}
        errorMessage={errors.imageID?.errorMessage}
        hasError={errors.imageID?.hasError}
        {...getOverrideProps(overrides, "imageID")}
      ></TextField>
      <TextField
        label="Created at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              userID,
              claimDate,
              imageID,
              createdAt: value,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <TextField
        label="Updated at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={updatedAt && convertToLocal(new Date(updatedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              userID,
              claimDate,
              imageID,
              createdAt,
              updatedAt: value,
            };
            const result = onChange(modelFields);
            value = result?.updatedAt ?? value;
          }
          if (errors.updatedAt?.hasError) {
            runValidationTasks("updatedAt", value);
          }
          setUpdatedAt(value);
        }}
        onBlur={() => runValidationTasks("updatedAt", updatedAt)}
        errorMessage={errors.updatedAt?.errorMessage}
        hasError={errors.updatedAt?.hasError}
        {...getOverrideProps(overrides, "updatedAt")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || dailyClaimModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || dailyClaimModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
