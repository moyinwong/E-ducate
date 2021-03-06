import React, { useState } from "react";
import "./CourseCreatePage.scss";
import { Field, Form, Formik, FormikConfig, FormikValues } from "formik";
import { TextField, Select, SimpleFileUpload } from "formik-material-ui";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@material-ui/core";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../redux/store";
import { push } from "connected-react-router";

const useStyles = makeStyles((theme) => ({
  formControl: {
    //   margin: theme.spacing(1),
    minWidth: "50%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const sleep = (time: number) => new Promise((acc) => setTimeout(acc, time));

const CourseCreatePage = () => {
  const classes = useStyles();
  const userEmail = useSelector((state: IRootState) => state.auth.email);

  const submitHandler = async (formData: FormData) => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/course/create/${userEmail}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await res.json();
    console.log(result)
  };

  const firstValidationSchema = Yup.object().shape({
    courseTitle: Yup.string()
      .min(3, "不如寫多啲")
      .max(50, "不如寫少啲")
      .required("必須填寫"),
    courseCategory: Yup.string().required("Required"),
  });

  const secondValidationSchema = Yup.object().shape({
    coursePrice: Yup.number()
      .min(40, "最低價錢為$40")
      .max(100000, "太貴啦")
      .required("必須填寫"),
    courseObjective: Yup.string()
      .min(5, "不如寫多啲")
      .max(100, "不如寫少啲")
      .required("必須填寫"),
    courseDescription: Yup.string()
      .min(5, "不如寫多啲")
      .max(100, "不如寫少啲")
      .required("必須填寫"),
    coursePrerequisite: Yup.string()
      .min(5, "不如寫多啲")
      .max(100, "不如寫少啲")
      .required("必須填寫"),
  });

  const thirdValidationSchema = Yup.object().shape({
    file: Yup.mixed().required("請提供課程封面"),
  });

  return (
    <div>
      <div className="course-creation-header">
        <Box paddingTop={2}>
          <Button
            href="/instructor"
            variant="contained"
            color="secondary"
            size="large"
          >
            Exit
          </Button>
        </Box>
      </div>

      <Card>
        <CardContent>
          <FormikStepper
            initialValues={{
              courseTitle: "",
              courseCategory: "",
              coursePrice: "",
              courseObjective: "",
              courseDescription: "",
              coursePrerequisite: "",
              file: null,
            }}
            onSubmit={async (values) => {
              // console.log(values.file)
              await sleep(1000);
              const formData = new FormData();
              formData.append("courseTitle", values.courseTitle);

              console.log(values.courseCategory)
              let courseCategoryId = values.courseCategory;

              
              formData.append("courseCategory", courseCategoryId);
              formData.append("coursePrice", values.coursePrice);
              formData.append("courseObjective", values.courseObjective);
              formData.append("courseDescription", values.courseDescription);
              formData.append("coursePrerequisite", values.coursePrerequisite);
              formData.append("file", values.file);

              submitHandler(formData);
            }}
          >
            <FormikStep
              label="課程名稱及種類"
              validationSchema={firstValidationSchema}
            >
              <Box paddingBottom={2}>
                <Field
                  name="courseTitle"
                  component={TextField}
                  placeholder="e.g. 中文5**攻略"
                  label="課程名稱"
                  className={classes.formControl}
                />
              </Box>
              <Box paddingBottom={2}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="courseCategory">課程類別</InputLabel>
                  <Field
                    fullWidth
                    name="courseCategory"
                    component={Select}
                    inputProps={{
                      id: "courseCategory",
                    }}
                  >
                    <MenuItem value={1}>中文</MenuItem>
                    <MenuItem value={2}>英文</MenuItem>
                    <MenuItem value={3}>數學</MenuItem>
                    <MenuItem value={4}>通識</MenuItem>
                    <MenuItem value={5}>物理</MenuItem>
                    <MenuItem value={6}>化學</MenuItem>
                    <MenuItem value={7}>生物</MenuItem>
                    <MenuItem value={8}>經濟</MenuItem>
                    <MenuItem value={9}>歷史</MenuItem>
                    <MenuItem value={10}>企會財</MenuItem>
                    <MenuItem value={11}>ICT</MenuItem>
                    <MenuItem value={12}>視覺藝術</MenuItem>
                    <MenuItem value={13}>M1</MenuItem>
                    <MenuItem value={14}>M2</MenuItem>
                    <MenuItem value={151}>編程</MenuItem>
                    <MenuItem value={152}>廚藝</MenuItem>
                    <MenuItem value={153}>DIY</MenuItem>
                    <MenuItem value={154}>美容</MenuItem>
                  </Field>
                </FormControl>
              </Box>
            </FormikStep>

            <FormikStep
              label="課程資料"
              validationSchema={secondValidationSchema}
            >
              <Box paddingBottom={2}>
                <Field
                  className={classes.formControl}
                  name="coursePrice"
                  type="number"
                  component={TextField}
                  placeholder="100"
                  label="課程價錢"
                />
              </Box>
              <Box paddingBottom={2}>
                <Field
                  className={classes.formControl}
                  name="courseObjective"
                  component={TextField}
                  placeholder="助學生提高中文水平"
                  label="課程目標"
                />
              </Box>
              <Box paddingBottom={2}>
                <Field
                  className={classes.formControl}
                  name="courseDescription"
                  component={TextField}
                  placeholder="e.g. 透過閱讀練習提升中文閱讀水平！"
                  label="課程內容"
                />
              </Box>
              <Box paddingBottom={2}>
                <Field
                  className={classes.formControl}
                  name="coursePrerequisite"
                  component={TextField}
                  placeholder="e.g. 中六程度中文"
                  label="課程要求"
                />
              </Box>
            </FormikStep>
            {/* <input id="file" name="file" type="file" onChange={(event) => {
                                let target = event.currentTarget as HTMLInputElement;
                                let files = target.files

                                if(!files || !files[0]) {
                                    return
                                }

                                props.setFieldValue("file", files[0]);
        
                            }} /> */}
            <FormikStep
              label="課程封面"
              validationSchema={thirdValidationSchema}
            >
              <Box paddingBottom={2}>
                <Field
                  className={classes.formControl}
                  component={SimpleFileUpload}
                  name="file"
                  label="上戴課程封面"
                />
                {/* <img src={image}></img> */}
              </Box>
            </FormikStep>
          </FormikStepper>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCreatePage;

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
  label: string;
}

export function FormikStep({ children }: FormikStepProps) {
  return <div>{children}</div>;
}

export function FormikStepper({
  children,
  ...props
}: FormikConfig<FormikValues>) {
  const dispatch = useDispatch();
  const childrenArray = React.Children.toArray(children) as React.ReactElement<
    FormikStepProps
  >[];
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step] as React.ReactElement<
    FormikStepProps
  >;
  const [completed, setCompleted] = useState(false);
  const classes = useStyles();

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
          helpers.resetForm();
          setStep(0);
          await sleep(2000);
          dispatch(push("/instructor"));
        } else {
          setStep((step) => step + 1);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper
            className={classes.formControl}
            alternativeLabel
            activeStep={step}
          >
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                completed={step > index || completed}
              >
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {!completed && currentChild}
          {step > 0 ? (
            <Button
              disabled={isSubmitting}
              onClick={() => setStep((step) => step - 1)}
            >
              Back
            </Button>
          ) : null}
          {!completed && (
            <Button
              startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
              disabled={isSubmitting}
              type="submit"
              variant="contained"
              color="primary"
            >
              {isSubmitting ? "Submitting" : isLastStep() ? "Submit" : "Next"}
            </Button>
          )}
          {/* <Button 
                    startIcon={isSubmitting ? <CircularProgress size="1rem"/> : null} 
                    disabled={isSubmitting} 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                >
                    {isSubmitting ? 'Submitting' : isLastStep() ? 'Submit' : 'Next'}
                </Button> */}
          {completed && (
            <div>
              成功建立課程<i className="fas fa-check-circle"></i>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
