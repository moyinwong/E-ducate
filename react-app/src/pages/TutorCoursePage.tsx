import React, { useState, useEffect } from 'react';
import { IPureCourse } from './InstructorPage';
import { useParams } from 'react-router-dom';
import { ICourse } from './CategoryPage';
import SingleCard from '../components/SingleCard';
import './TutorCoursePage.scss';

interface ITutorInfo {
    id: number;
    name: string;
    image: string;
    linkedin: string | null;
    email: string;
    title: string;
    introduction: string;
}

const TutorCoursePage = () => {
    const param: { tutorEmail: string } = useParams();
    const tutorEmail = param.tutorEmail;
    const [totalStudents, setTotalStudents] = useState<number | null>(null)
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [tutorInfo, setTutorInfo] = useState<ITutorInfo | null>(null);

    const getTutorInfo = async () => {
        let queryRoute = '/course/tutor/info'
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}${queryRoute}/${tutorEmail}`)
        const result = await res.json();
        const tutorInfo = result.tutorInfo;
        setTutorInfo(tutorInfo)
    }

    const getAllCourseByTutor = async (userEmail: string | null | undefined) => {
        let queryRoute = '/course/tutor'
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}${queryRoute}/${userEmail}`)
        const result = await res.json();
        const { courses } = result;
        const orderedCourses = courses.slice();
        orderedCourses.sort(
            (a: IPureCourse, b: IPureCourse) =>
                b.id - a.id
        )
        setCourses(orderedCourses);
    }

    const getTotalStudentsByTutor = async () => {
        let queryRoute = '/course/tutor/number-of-students'
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}${queryRoute}/${tutorEmail}`)
        const result = await res.json();
        const students = result.totalStudentNumber
        const totalStudents: number = students.student_num
        setTotalStudents(totalStudents)
    }

    useEffect(() => {
        if(tutorEmail) {
            getAllCourseByTutor(tutorEmail);
            getTutorInfo();
            getTotalStudentsByTutor();
        }
    }, [tutorEmail])

    return (
        <div>
            <div className="course-section-title-container">
                <div className="tutor-info-section">
                    <div className="tutor-name">{tutorInfo?.name}</div>
                    <div className="tutor-title">{tutorInfo?.title}</div>
                    <div className="tutor-intro-title">總學生人數：{totalStudents}</div>
                    <div className="tutor-intro-title">關於我</div>
                    <div className="tutor-intro">{tutorInfo?.introduction}</div>
                </div>
                <div className="tutor-image">
                    {tutorInfo?.image.match(/http/) ? (
                        <img 
                            style={{height: '150px'}} 
                            src={tutorInfo.image} 
                            alt="tutor"
                        />
                    ) : (<img 
                            style={{height: '150px'}} 
                            src={`${process.env.REACT_APP_BACKEND_IMAGE}/${tutorInfo?.image}`}
                            alt="tutor"
                        />)}
                    <div>{tutorInfo?.linkedin}</div>
                </div>
            </div>
            <h1>我教授的課程 ({courses.length})</h1>
            <div className="course-card-container">
                {courses.map((course, index) => (
                    <div className="course-card" key={index}>
                        <SingleCard {...course} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TutorCoursePage
