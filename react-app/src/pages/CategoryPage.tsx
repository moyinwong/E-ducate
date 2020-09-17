import { push } from "connected-react-router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Accordion, Card, Dropdown } from "react-bootstrap";
import { DropdownButton } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Redirect, useLocation, useParams } from "react-router-dom";
import "./CategoryPage.scss";
import NotFound from "./NotFound";
import FlattedCard from "../components/FlattedCard";

export interface ICourse {
  course_name: string;
  objective: string;
  prerequisites: string;
  price: number;
  id: number;
  tutor_name: string;
  lessons_number: number;
  avg: number;
  image: string;
}

const CategoryPage: React.FC = () => {
  const [courses, setCourses] = useState<Array<ICourse>>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [orderMethod, setOrderMethod] = useState("最受歡迎");
  const param: { categoryName: string } = useParams();

  const { categoryName } = param;

  //to check current route
  let location = useLocation();

  const getAllCoursesByCategory = async () => {
    let queryRoute: string = "/category/";

    //if is "others" category, change the api route
    if (location.pathname.match(/others/)) {
      queryRoute += "others/";
    }

    const fetchRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}${queryRoute}${categoryName}`
    );

    //if no such category
    if (fetchRes.status === 500) {
      return <NotFound />;
    }

    const result = await fetchRes.json();

    setCourses(result.courses);
  };

  //handle order button click
  function handleOrderButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log(event.currentTarget.innerHTML);
    const newMethod = event.currentTarget.innerHTML;
    setOrderMethod(newMethod);
  }

  //control panel
  const panelStyle = {
    width: isFilterOpen ? 300 : 0,
    transition: "all 0.3s ease-in",
  };

  //run once when init
  useEffect(() => {
    getAllCoursesByCategory();
  }, []);

  return (
    <div className={"main-container"}>
      <div>
        <h1>所有{categoryName}課程</h1>
      </div>

      <Button
        variant="outline-secondary"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        篩選
      </Button>
      <DropdownButton
        variant="outline-secondary"
        id="dropdown-basic-button"
        title={orderMethod}
      >
        <Dropdown.Item onClick={handleOrderButtonClick}>最受歡迎</Dropdown.Item>
        <Dropdown.Item onClick={handleOrderButtonClick}>最低價錢</Dropdown.Item>
        <Dropdown.Item onClick={handleOrderButtonClick}>最受好評</Dropdown.Item>
        <Dropdown.Item onClick={handleOrderButtonClick}>最受好評</Dropdown.Item>
      </DropdownButton>
      <div className={"panel-card-container"}>
        <div className={"panel"} style={panelStyle}>
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                評分
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>評分選項</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                價錢
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>價錢選項</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>

        {courses.map((course, i) => (
          <FlattedCard key={i} {...course}></FlattedCard>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;