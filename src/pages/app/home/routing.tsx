import { HomeRouteItem, SidebarElement } from "../../../types/app/home";
import { CreateQuestion, Profile, QuestionList } from "./homeIndex";
import { Help, Home, Error } from "@mui/icons-material";
import QuestionDetail from "./questionDetail/QuestionDetail";

export const routeItems: HomeRouteItem[] = [
    {path: 'profile', element: <Profile />},
    {path: 'create-question', element: <CreateQuestion />},
    {path: 'questions', element: <QuestionList />},
    {path: 'question/:id', element: <QuestionDetail />},
]

export const elements: SidebarElement[] = [
    {path: 'profile', name: 'Home', icon: <Home />},
    {path: 'create-question', name: '質問する', icon: <Help />},
    {path: 'questions', name: '回答する', icon: <Error />},
]
