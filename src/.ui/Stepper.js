import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import "bs-stepper/dist/css/bs-stepper.min.css";
import { default as BSStepper } from "bs-stepper";

let counter = 0;

export const Stepper = React.forwardRef(({ steps = [], ...props }, ref) => {
  const scopeEl = useRef();
  const stepCount = steps.length;

  useEffect(() => {
    new BSStepper(scopeEl.current, {
      linear: false,
      animation: true,
      ...props
    });
    return () => {
      scopeEl.current.bsStepper.destroy();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    ref: scopeEl.current,
    next: () => scopeEl.current.bsStepper.next(),
    previous: () => scopeEl.current.bsStepper.previous(),
    to: stepNumber => scopeEl.current.bsStepper.to(stepNumber),
    reset: () => scopeEl.current.bsStepper.reset()
  }));

  // Events

  return (
    <div className="bs-stepper" ref={scopeEl}>
      <div className="bs-stepper-header" role="tablist">
        {steps.map((step, idx) => {
          step.id = `tab${counter++}`;
          const { header } = step;
          return (
            <>
              <div className="step" data-target={`#${step.id}`}>
                <button className="step-trigger" role="tab">
                  <span className="bs-stepper-circle">{header.circle || idx + 1}</span>
                  <span className="bs-stepper-label">{header.label}</span>
                </button>
              </div>
              {idx + 1 < stepCount && <div class="line" />}
            </>
          );
        })}
      </div>
      <div className="bs-stepper-content">
        {steps.map(step => {
          const { content, style } = step;
          return (
            <div id={step.id} className="content" role="tabpanel" style={style}>
              {typeof content === "function" ? content() : content}
            </div>
          );
        })}
      </div>
    </div>
  );
});
