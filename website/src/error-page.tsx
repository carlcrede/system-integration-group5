import { useRouteError } from "react-router-dom";

function ErrorPpage() {
    const error = useRouteError();
    console.error(error);
    return (
        <div>error-page</div>
    )
}

export default ErrorPpage;