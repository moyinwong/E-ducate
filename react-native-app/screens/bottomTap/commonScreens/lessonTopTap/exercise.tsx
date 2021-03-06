// React, React Native
import React, { useCallback, useContext } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';

// Context
import { LessonContext } from '../../../../contexts/lessonContext';

// Navigation
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

// Data
import envData from '../../../../data/env';

// Icons
import { MaterialIcons, Entypo } from '@expo/vector-icons';

// Styles
import globalStyles from '../../../../styles/globalStyles';
import exerciseStyles from '../../../../styles/exerciseStyles';

export default function Exercise() {

    // Context
    const { lessonName, questionsAnswers, filteredQuestions, saveAnswer, correctAnswers, setCorrectAnswers } = useContext(LessonContext);

    // Hooks
    const route = useRoute();
    const navigation = useNavigation();

    // Params
    let viewingCondition = '';

    if (route.params) {
        if (route.params.viewingCondition) {
            viewingCondition = route.params.viewingCondition;
        }
    }

    // Submit
    async function submitAnswers() {
        let tempAnswers: any = {};
        for (let item of questionsAnswers) {
            if (item.isSelected) {
                let key = item.question;
                tempAnswers[key] = item.answer_body;
            }
        }

        let queryRoute = '/lesson/check/';
        const res = await fetch(`${envData.REACT_APP_BACKEND_URL}${queryRoute}${lessonName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...tempAnswers
            }),
        });
        const json = await res.json();

        let tempObject: any = {};
        for (let item of json.result) {
            let tempKey = Object.keys(item)[0];
            tempObject[tempKey] = item[tempKey];
        }

        setCorrectAnswers(tempObject);
    }

    let nothing = 'nothing';
    useFocusEffect(
        useCallback(() => {
            setCorrectAnswers([]);
        }, [nothing])
    );

    return (
        <View style={globalStyles.container}>

            <TouchableOpacity
                style={exerciseStyles.goBackButton}
                onPress={() => navigation.pop()
                }
            >

                <Text style={exerciseStyles.goBackText}>返回課程</Text>
            </TouchableOpacity>

            {viewingCondition == 'purchased' ? (

                filteredQuestions[0] ? (
                    filteredQuestions.map(questionItem => {
                        return (
                            <View
                                key={questionItem.question_id}
                                style={exerciseStyles.questionBox}
                            >
                                <View style={exerciseStyles.questionContainer}>
                                    <Text style={exerciseStyles.questionText}>{questionItem.question}</Text>
                                </View>
                                {questionsAnswers.filter(item => (item.question_id === questionItem.question_id)).map(answerItem => {
                                    return (
                                        <Pressable
                                            key={answerItem.answer_id}
                                            style={exerciseStyles.answerBox}
                                            onPress={() => saveAnswer(questionItem.question_id, answerItem.answer_id)}
                                        >
                                            {answerItem.isSelected ? (
                                                <View style={exerciseStyles.selectedBox}>
                                                    <Text style={{ ...exerciseStyles.answerText, color: '#ffffff' }}>{answerItem.answer_body}</Text>

                                                </View>
                                            ) : (
                                                    <View style={exerciseStyles.nonSelectedBox}>
                                                        <Text style={exerciseStyles.answerText}>{answerItem.answer_body}</Text>
                                                    </View>
                                                )}
                                        </Pressable>
                                    )
                                })}
                                {correctAnswers[questionItem.question] && (
                                    correctAnswers[questionItem.question] == 'correct' ? (
                                        <View style={exerciseStyles.answerContainer}>
                                            <MaterialIcons name="done" size={24} color="#22c736" />
                                            <Text style={{ ...exerciseStyles.answerDisplay, color: "#22c736" }}>正確</Text>
                                        </View>
                                    ) : (
                                            <View style={exerciseStyles.answerContainer}>
                                                <Entypo name="cross" size={24} color="#e96a43" />
                                                <Text style={{ ...exerciseStyles.answerDisplay, color: "#e96a43" }}>錯誤</Text>
                                            </View>
                                        )
                                )}
                            </View>
                        )
                    })
                ) : (
                        <View style={exerciseStyles.titleContainer}>
                            <Text style={exerciseStyles.title}>暫未有練習</Text>
                        </View>
                    )
            ) : (
                    <View style={exerciseStyles.titleContainer}>
                        <Text style={exerciseStyles.title}>請先購買此課程</Text>
                    </View>
                )}


            {(filteredQuestions[0] && viewingCondition == 'purchased') && (
                <View style={exerciseStyles.submitButtonContainer}>
                    <TouchableOpacity
                        style={exerciseStyles.submitButton}
                        onPress={() => submitAnswers()}
                    >
                        <Text style={exerciseStyles.submitButtonText}>提交</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    )
}
