import { useEffect, useState } from "react";
import Button from "./UI/Button";
import '../../css/Components/Stepper.css';
import { Fragment } from "react";



const Stepper = ({ steps, setStepsVisited, setActualStep, cambioRealBool, cambioRealRetorno }) => {

    const [visitedSteps, setVisitedSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    //const [cambioReal, setCambioReal] = useState(false);

    /*
    const handleNext = () => {
        const updatedVisitedSteps = [...visitedSteps, currentStep + 1];
        setVisitedSteps(updatedVisitedSteps);
        setCurrentStep(currentStep + 1);
    };*/

    const handlePrev = () => {
        const updateSteps = visitedSteps.filter((index) => index !== currentStep);
        setVisitedSteps(updateSteps);
        setCurrentStep(currentStep - 1);
    };

    useEffect(() => {
        //setVisitedSteps([0]);
        //if (cambioRealBool) {
            //console.log(`StepVisitados ${setStepsVisited}, StepActual ${setActualStep}`)

            setVisitedSteps([...setStepsVisited])
            setCurrentStep(setActualStep);
            //cambioRealRetorno(true);
        //}        

    }, [steps, setStepsVisited, setActualStep]);
    //}, [steps, setStepsVisited, setActualStep, cambioRealBool]);

    return (
        <div className="stepper-container">
            <div className='' style={{ width: '80%' }}>
                <div className='' style={{ width: '100%' }}>

                    <div className='step-largo-barra'>
                        <div className="steps-progress">
                            <div className="progress-bar" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
                        </div>
                    </div>

                    <div className="steps-container">
                        {steps.map((step, index) => (
                            <Fragment key={index }>
                                <div key={index} className={`step ${visitedSteps.includes(index) ? 'active' : ''}`}>
                                <span>
                                        {index + 1}
                                    </span>
                                    <span className='span_step'> {currentStep === index ? step : ''} </span>

                                    {/* SI SE ELIMINA LA SIGUIENTE LINEA, ELIMINAR LA PROPIEDAD transform DE LA CLASE step-largo-barra  */}
                                </div>

                            </Fragment>

                        ))}
                    </div>
                </div>

                {/*<div className=''>*/}
                {/*    <br /><br /><br />*/}
                {/*    <div className="step-content">*/}
                {/*        <div className="step-inner">*/}
                {/*            <div className="step-description">{steps[currentStep]}</div>*/}
                {/*            <div className="row buttons">*/}
                {/*                */}{/*<Button className="btn_mg__primary" disabled={currentStep === 0} onClick={handlePrev}>Paso Previo</Button>*/}
                {/*                <Button className="btn_mg__primary" disabled={currentStep === steps.length - 1} onClick={handleNext}>Paso Siguiente</Button>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    );


};

export default Stepper;
