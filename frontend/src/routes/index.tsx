import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} /> // Rota /home
				<Route path="*" element={<Navigate to="/" />} /> // Redireciona pra Home se User tentar acessar rota q n existe
        //
        // TODO: rotas /login, /signin
        //
			</Routes>
		</BrowserRouter>
	);
}