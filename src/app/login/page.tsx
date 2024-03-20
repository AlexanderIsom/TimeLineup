import LoginButton from "@/components/loginButton";

export default async function Login() {

	return (
		<div >
			Login
			<LoginButton provider="google" >Login with Google</LoginButton>
			<LoginButton provider="discord" >Login with Discord</LoginButton>
		</div >
	);
}