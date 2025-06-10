import { useState, type ChangeEvent, type FormEvent, useCallback } from 'react';
import FeedbackService from '../services/FeedbackService'; 
import ErrorHandler from '../components/handler/ErrorHandler'; 
import AlertMessage from '../components/AlertMessage'; 
import type { FeedbackFieldErrors } from '../components/interfaces/feedback/FeedbackFieldErrors'; 
import type { FeedbackPayload } from '../components/interfaces/feedback/FeedbackPayload'; // Import FeedbackPayload
import SmolSpinner from '../components/SmolSpinner';
import MainLayout from './layout/MainLayout';
import { Link } from 'react-router-dom';

interface FeedbackPageState {
    loadingStore: boolean;
    email: string;
    feedbackMessage: string;
    rating: number;
    hoverRating: number;
    alertMessage: string;
    isAlertSuccess: boolean;
    isAlertVisible: boolean;
    errors: FeedbackFieldErrors;
}

const Feedback = () => {
    const [state, setState] = useState<FeedbackPageState>({
        loadingStore: false,
        email: '',
        feedbackMessage: '',
        rating: 0,
        hoverRating: 0,
        alertMessage: '',
        isAlertSuccess: false,
        isAlertVisible: false,
        errors: {} as FeedbackFieldErrors,
    });
    
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
            errors: {},
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value,
            errors: {
                ...prevState.errors,
                [name]: undefined,
            },
        }));
    };

    const handleClickRating = useCallback((selectedRating: number) => {
        setState(prevState => ({
            ...prevState,
            rating: selectedRating,
            errors: { ...prevState.errors, rating: undefined },
        }));
    }, []); 

    const handleMouseEnterStar = useCallback((hoveredValue: number) => {
        setState(prevState => ({ ...prevState, hoverRating: hoveredValue }));
    }, []); 

    const handleMouseLeaveStars = useCallback(() => {
        setState(prevState => ({ ...prevState, hoverRating: 0 }));
    }, []); 


    const HandleStoreFeedback = (e: FormEvent) => {
        e.preventDefault();

        if (state.rating < 1 || state.rating > 5) {
            setState(prevState => ({
                ...prevState,
                errors: { ...prevState.errors, rating: ["Please provide a valid Rating (1-5)."] },
                alertMessage: "Please provide a valid Rating (1-5).", 
                isAlertSuccess: false,
                isAlertVisible: true,
            }));
            return;
        }
        if (!state.feedbackMessage.trim()) {
            setState(prevState => ({
                ...prevState,
                errors: { ...prevState.errors, message: ["The message field is required."] },
                alertMessage: "The message field is required.",
                isAlertSuccess: false,
                isAlertVisible: true,
            }));
            return;
        }

        setState(prevState => ({
            ...prevState,
            loadingStore: true,
            errors: {} as FeedbackFieldErrors,
        }));
        handleCloseAlertMessage();

        // sending the data to database
        const payload: FeedbackPayload = {
            email: state.email.trim() === '' ? undefined : state.email, 
            message: state.feedbackMessage,
            rating: state.rating, 
        };

        FeedbackService.StoreFeedback(payload) 
            .then((res) => { 
                if (res.data.success) { 
                    const emailConfirmationMsg = payload.email ? ` Sent a confirmation to ${payload.email}!` : '';
                    handleShowAlertMessage(`${res.data.message}${emailConfirmationMsg}`, true, true );
                    setState(prevState => ({
                        ...prevState,
                        email: '',
                        feedbackMessage: '',
                        rating: 0,
                        hoverRating: 0,
                        errors: {} as FeedbackFieldErrors,
                    }));
                } else {
                    handleShowAlertMessage(res.data.message || 'Failed to send feedback.', false, true);
                }
            })
            .catch((error) => {
                if (error.response?.status === 422 && error.response?.data?.errors) {
                    setState(prevState => ({
                        ...prevState,
                        errors: error.response.data.errors,
                        alertMessage: "Please correct the highlighted fields.",
                        isAlertSuccess: false,
                        isAlertVisible: true,
                    }));
                } else {
                    ErrorHandler(error, null); 
                    const errorMessage = error.response?.data?.message || 'An error occurred while sending feedback. Please try again.';
                    handleShowAlertMessage(errorMessage, false, true);
                }
            })
            .finally(() => {
                setState(prevState => ({
                    ...prevState,
                    loadingStore: false,
                }));
            });
    };

    const content = (
        <>
            <div className="container mt-4"> 
                <AlertMessage message={state.alertMessage} isSuccess={state.isAlertSuccess} isVisible={state.isAlertVisible} onClose={handleCloseAlertMessage}/>
                <div className="card shadow-sm rounded-lg p-4">
                    <h4 className='fw-bold text-center pb-4'>Feedback Form</h4> 
                    <form onSubmit={HandleStoreFeedback}>
                        <div className="row g-3"> 

                            <div className="col-md-6"> 
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Rating (1-5)</label>
                                    <div className={`d-flex align-items-center ${state.errors.rating ? 'border border-danger rounded p-1' : ''}`} onMouseLeave={handleMouseLeaveStars} aria-label="Rating">
                                        {[1, 2, 3, 4, 5].map((starValue) => (
                                            <svg key={starValue} className={`me-1`} style={{ width: '5rem', height: '5rem', cursor: 'pointer', transition: 'color 0.2s' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" onClick={() => handleClickRating(starValue)} onMouseEnter={() => handleMouseEnterStar(starValue)} aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}>
                                                <path style={{ color: (state.hoverRating || state.rating) >= starValue ? '#FBBF24' : '#D1D5DB' }} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z"></path>
                                            </svg>
                                        ))}
                                    </div>
                                    {state.errors.rating && (
                                        <div className="invalid-feedback d-block">{state.errors.rating[0]}</div>
                                    )}
                                    <input type="hidden" name="rating" value={state.rating} /> 
                                </div>
                            </div>

                            <div className="col-md-6"> 
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">Email (Optional)</label>
                                    <input type="email" id="email" name="email" className={`form-control ${state.errors.email ? "is-invalid" : ""}`} placeholder="joe@gmail.com" value={state.email} onChange={handleInputChange} disabled={state.loadingStore}/>
                                    {state.errors.email && (
                                        <div className="invalid-feedback d-block">{state.errors.email[0]}</div> 
                                    )}
                                </div>
                            </div>


                            <div className="col-12"> 
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label fw-bold">Message</label> {/* Label no longer says optional */}
                                    <textarea id="message" name="feedbackMessage" rows={5} required className={`form-control ${state.errors.message ? "is-invalid" : ""}`} placeholder="How is your experience?" value={state.feedbackMessage} onChange={handleInputChange} disabled={state.loadingStore}></textarea>
                                    {state.errors.message && (
                                        <div className="invalid-feedback d-block">{state.errors.message[0]}</div>
                                    )}
                                </div>
                            </div>
                        </div> 

                        <div className="d-flex justify-content-end mt-4 gap-2">
                            <Link className="btn btn-secondary" to={'/'}>Back</Link>
                            <button type="submit" className="btn btn-primary" disabled={state.loadingStore}>
                                {state.loadingStore ? (
                                    <>
                                        <SmolSpinner /> Sending... 
                                    </>
                                ) : (
                                    "Submit Feedback"
                                )}
                            </button>
                        </div>
                    </form>
                </div> 
            </div> 
        </>
    );

    return <MainLayout content={content}/>
};

export default Feedback;