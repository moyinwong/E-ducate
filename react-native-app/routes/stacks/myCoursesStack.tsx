// React, React Native
import React from 'react';

// Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Icons
import { FontAwesome } from '@expo/vector-icons';

// Routes
import MyCoursesTopTap from '../topTap/myCoursesTopTap';

// Screens
import Course from '../../screens/bottomTap/commonScreens/course';
import Lesson from '../../screens/bottomTap/commonScreens/lesson';
import Exercise from '../../screens/bottomTap/commonScreens/exercise';

// Components
import HeaderTitle from '../../sharedComponents/headerTitle';

// Functions
import stackTransition from '../../functions/stackTransition';

export default function TutorStack(props: { navigation: { toggleDrawer: () => void; }; }) {
    const Stack = createStackNavigator();

    function toggleDrawerClick(): void {
        props.navigation.toggleDrawer();
    }

    return (
        <Stack.Navigator
            headerMode="float"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#5b96f7",
                    height: 70
                },
                headerTintColor: '#fff',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
                headerLeft: (props) => (
                    <FontAwesome name="navicon" color={props.tintColor} size={24}
                        onPress={() => {
                            toggleDrawerClick();
                        }}
                    />
                ),
                headerLeftContainerStyle: {
                    marginLeft: 18
                }
            }}
        >
            <Stack.Screen
                name="MyCourses"
                children={MyCoursesTopTap}
                options={{
                    headerTitle: (props) => (
                        <HeaderTitle title={'我的課程'} />
                    ),
                    ...stackTransition
                }}
            />
            <Stack.Screen
                name="Course"
                component={Course}
                options={{
                    headerTitle: (props) => (
                        <HeaderTitle title={'課程'} />
                    ),
                    ...stackTransition
                }}
            />
            <Stack.Screen
                name="Lesson"
                component={Lesson}
                options={{
                    headerTitle: (props) => (
                        <HeaderTitle title={'課堂'} />
                    ),
                    ...stackTransition
                }}
            />
            <Stack.Screen
                name="Exercise"
                component={Exercise}
                options={{
                    headerTitle: (props) => (
                        <HeaderTitle title={'練習'} />
                    ),
                    ...stackTransition
                }}
            />
        </Stack.Navigator>
    )
}
