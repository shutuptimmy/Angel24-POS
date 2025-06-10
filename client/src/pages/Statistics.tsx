// src/pages/ReportsAndStatisticsPage.tsx

import { useEffect, useState, useCallback, useRef } from 'react';
import FeedbackService from '../services/FeedbackService'; 
import ErrorHandler from '../components/handler/ErrorHandler'; 
import AlertMessage from '../components/AlertMessage'; 
import type { Feedbacks } from '../components/interfaces/feedback/Feedbacks'; 

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Chart,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'; 
import MainLayout from './layout/MainLayout';
import Spinner from '../components/Spinner';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement 
);

interface ReportsAndStatisticsPageState {
    loading: boolean;
    feedbacks: Feedbacks[];
    alertMessage: string;
    isAlertSuccess: boolean;
    isAlertVisible: boolean;
}

const Statistics = () => {
    const [state, setState] = useState<ReportsAndStatisticsPageState>({
        loading: true,
        feedbacks: [],
        alertMessage: '',
        isAlertSuccess: false,
        isAlertVisible: false,
    });

    const chartRef = useRef<Chart<'bar'> | null>(null); 

    const handleShowAlertMessage = useCallback((
        message: string,
        isSuccess: boolean,
        isVisible: boolean
    ) => {
        setState(prevState => ({
            ...prevState,
            alertMessage: message,
            isAlertSuccess: isSuccess,
            isAlertVisible: isVisible,
        }));
    }, []);

    const handleCloseAlertMessage = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            alertMessage: '',
            isAlertSuccess: false,
            isAlertVisible: false,
        }));
    }, []);

    const loadFeedbacks = useCallback(() => {
        setState(prevState => ({ ...prevState, loading: true }));
        handleCloseAlertMessage();

        FeedbackService.LoadFeedbacks()
            .then((response) => {
                const fetchedFeedbacks = response.data.feedbacks;
                setState(prevState => ({
                    ...prevState,
                    feedbacks: fetchedFeedbacks,
                    loading: false,
                }));
                if (fetchedFeedbacks.length === 0) {
                    handleShowAlertMessage("No feedback data found to display.", true, true);
                }
            })
            .catch((error) => {
                ErrorHandler(error, null);
                const errorMessage = error.response?.data?.message || 'Failed to load feedback data.';
                handleShowAlertMessage(errorMessage, false, true);
                setState(prevState => ({ ...prevState, loading: false }));
            });
    }, [handleShowAlertMessage, handleCloseAlertMessage]); 

    useEffect(() => {
        document.title = "Reports & Statistics";
        loadFeedbacks();
    }, [loadFeedbacks]); 

    const getChartData = useCallback(() => {
        const ratingCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        state.feedbacks.forEach(feedback => {
            if (feedback.rating >= 1 && feedback.rating <= 5) {
                ratingCounts[feedback.rating]++;
            }
        });

        return {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [
                {
                    label: 'Number of Feedbacks',
                    data: [
                        ratingCounts[1],
                        ratingCounts[2],
                        ratingCounts[3],
                        ratingCounts[4],
                        ratingCounts[5],
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)', 
                        'rgba(255, 159, 64, 0.6)', 
                        'rgba(255, 205, 86, 0.6)', 
                        'rgba(75, 192, 192, 0.6)', 
                        'rgba(54, 162, 235, 0.6)', 
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [state.feedbacks]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Feedback Chart',
                font: {
                    size: 18,
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Rating',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Feedbacks',
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1, 
                },
            },
        },
    };

    const content = (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Reports and Statistics</h2>

            <AlertMessage message={state.alertMessage} isSuccess={state.isAlertSuccess} isVisible={state.isAlertVisible} onClose={handleCloseAlertMessage}/>

            {state.loading ? (
                <>
                <div className='text-center'>
                    <Spinner />
                </div>
                </>
            ) : (
                <>
                    <div className="card shadow-sm mb-4 rounded-lg p-3">
                        <div className="card-body">
                            <div style={{ height: '400px' }}> 
                                {state.feedbacks.length > 0 ? (
                                    <Bar ref={chartRef} data={getChartData()} options={chartOptions} />
                                ) : (
                                    <p className="text-center text-muted">No feedback data available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm rounded-lg p-3">
                        <div className="card-body">
                            <h5 className="card-title text-center mb-3">Feedback logs</h5>
                            {state.feedbacks.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Email</th>
                                                <th>Message</th>
                                                <th>Rating</th>
                                                <th>Date Submitted</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {state.feedbacks.map((feedback) => (
                                                <tr key={feedback.feedback_id}>
                                                    <td>{feedback.feedback_id}</td>
                                                    <td>{feedback.email || 'N/A'}</td>
                                                    <td>{feedback.message || 'No Message'}</td>
                                                    <td>{feedback.rating} / 5</td>
                                                    <td>{new Date(feedback.created_at).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-muted">No feedback records found.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    return <MainLayout content={content} />
};

export default Statistics;