import { Link } from 'react-router-dom';


const LoginErrorPage = () => {
    return (
        <div class="container">
            <h1 class="title">Login Error</h1>
            <p class="login-error-message">You are not logged in. Please log in. </p>
            <Link to="/admin/login">
                <button className="sign-in-button">Login</button>
            </Link>
        </div>
    );
};


export default LoginErrorPage;
