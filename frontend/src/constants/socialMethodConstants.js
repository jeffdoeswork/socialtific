export const socialMethodSteps = [
    {step:"Data", text:"Step 1: Use pre existing Data or create your own"},
    {step:"Hypothesis", text:"Step 2: Use a pre existing Hypothesis or create your own"},
    {step:"Experiment", text:"Step 3: Use a pre existing Expermient or create your own"}
]

export const initialSocialMethod = {
    new:true,
    title:"",
    data:[],
    hypothesis:[],
    experiment:[],
    conclusion:"",
    autosave:"",
    conclusionId:"",
    updateReplace:false

} // This is acutally used by a React component as well