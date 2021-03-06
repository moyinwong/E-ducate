import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { push } from "connected-react-router";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
//import { Elements } from "react-stripe-elements";
import CheckoutForm from "../components/CheckoutForm";
import { ICourse } from "./CategoryPage";
import "./PaymentPage.scss";
// const stripePromise = loadStripe(
//   process.env.REACT_APP_STRIPE_TEST_KEY as string
// );

const PaymentPage: React.FC = (state: {
  children?: React.ReactNode;
  location?: {
    state?: {
      course?: ICourse;
      pastLocation: {
        pathname?: string;
      };
    };
  };
}) => {
  const dispatch = useDispatch();
  console.log(state);
  const immedatePurchaseCourse: ICourse | undefined =
    state.location?.state?.course;

  const pastLocation: string | undefined =
    state.location?.state?.pastLocation.pathname;
  console.log("past1", pastLocation);
  useEffect(() => {
    document.getElementById("website-header")!.style.display = "none";
    return () => {
      document.getElementById("website-header")!.style.display = "block";
    };
  }, []);

  const stripePromise = loadStripe(
    "pk_test_51H5XkyCDvfrPMmRKTzJR6lhsYHm6bUyjWqh9YVxA8dYkhAxRR2QqVUdaCuWAF0tPDaQNCoZRmSHI7jTnUODDcXUN00rXrCxG5M"
  );
  return (
    <>
      <Button
        variant="link"
        onClick={() => {
          dispatch(push(pastLocation ? pastLocation : "/cart"));
        }}
        className="stripe-form-back-button"
      >
        返回
      </Button>
      <div className="stripe-form-container">
        <Elements stripe={stripePromise}>
          {/* <InjectedCheckoutForm elements="" stripe="" /> */}
          <CheckoutForm
            immediatePurchaseCourse={immedatePurchaseCourse}
            pastLocation={pastLocation}
          />
        </Elements>
      </div>
    </>
  );
};

export default PaymentPage;
