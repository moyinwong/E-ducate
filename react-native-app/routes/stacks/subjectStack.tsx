// React, React Native
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Icons
import { FontAwesome } from '@expo/vector-icons';

// Routes
import SubjectTopTap from '../topTap/subjectTopTap';
import CourseTopTap from '../topTap/courseTopTap';
import LessonTopTap from '../topTap/lessonTopTap';
import TrialTopTap from "../topTap/trialTopTap";

// Screens
import TutorInfo from '../../screens/bottomTap/commonScreens/tutorInfo';
import CoursesList from '../../screens/bottomTap/commonScreens/coursesList';
import StripeForm from "../../screens/bottomTap/commonScreens/StripeForm";
import PaymentLoading from "../../screens/bottomTap/cartStack/paymentLoading";
import PaymentSuccess from "../../screens/bottomTap/cartStack/paymentSuccess";
import PaymentFail from "../../screens/bottomTap/cartStack/paymentFail";

// Functions
import stackTransition from '../../functions/stackTransition';
import paymentTransition from "../../functions/paymentTransition";

export default function SubjectStack(props: { navigation: { toggleDrawer: () => void; }; }) {
    const Stack = createStackNavigator();

    function toggleDrawerClick(): void {
        props.navigation.toggleDrawer();
    }

    return (
        <Stack.Navigator
            initialRouteName="Subject"
            headerMode="float"
            screenOptions={{
                headerTintColor: '#fff',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerLeft: (props) => (
                    <FontAwesome name="navicon" color={props.tintColor} size={24}
                        onPress={() => {
                            toggleDrawerClick();
                        }}
                    />
                ),
                headerBackground: () => (
                    <LinearGradient
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        colors={['rgba(119, 251, 176, 1)', 'rgba(166, 241, 141, 1)']}
                        style={{ height: '100%', width: '100%' }}
                    >
                    </LinearGradient>
                ),
                headerLeftContainerStyle: {
                    marginLeft: 18
                }
            }}
        >
            <Stack.Screen
                name="Subject"
                children={SubjectTopTap}
                options={{
                    title: '科目',
                    ...stackTransition
                }}
            />
            <Stack.Screen
                name="CoursesList"
                component={CoursesList}
                options={{
                    title: '課程列表',
                    ...stackTransition
                }}
            />
            <Stack.Screen
                name="Course"
                children={CourseTopTap}
                options={{
                    title: '課程',
                    ...stackTransition
                }}
            />
            <Stack.Screen
                name="Tutor"
                component={TutorInfo}
                options={{
                    title: '導師',
                    ...stackTransition
                }}
            />
            <Stack.Screen
                name="Lesson"
                children={LessonTopTap}
                options={{
                    title: '課堂',
                    ...stackTransition
                }}
            />
            <Stack.Screen
                name="Trial"
                children={TrialTopTap}
                options={{
                    title: "課堂",
                    ...stackTransition,
                }}
            />
            <Stack.Screen
                name="StripeForm"
                children={StripeForm}
                options={{
                    title: "信用卡資料",
                    ...stackTransition,
                }}
            />
            <Stack.Screen
                name="PaymentLoading"
                children={PaymentLoading}
                options={{
                    headerShown: false,
                    title: "付款處理中",
                    ...paymentTransition,
                }}
            />
            <Stack.Screen
                name="PaymentSuccess"
                children={PaymentSuccess}
                options={{
                    headerShown: false,
                    title: "付款成功",
                    ...paymentTransition,
                }}
            />
            <Stack.Screen
                name="PaymentFail"
                children={PaymentFail}
                options={{
                    headerShown: false,
                    title: "付款失敗",
                    ...paymentTransition,
                }}
            />
        </Stack.Navigator >
    )
}
