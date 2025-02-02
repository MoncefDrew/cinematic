import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import {Movie} from "@/constants/Movie";

export type RootDrawerParamList = {
    '(tabs)/Popular': undefined;
    '(tabs)/Search': undefined;
    '(tabs)/Profile': undefined;
    '(tabs)/Watchlist': undefined;
    '(tabs)/Program': undefined;
    '(tabs)/Activity': undefined;
    '(tabs)/Settings': undefined;
    '(tabs)/SignOut': undefined;
    '(tabs)/MovieDetails': undefined;
    'auth/sign-in': undefined;
    'auth/sign-up': undefined;
    '(tabs)/TicketPage':undefined;
    '(tabs)/ReserveTicket':{Movie:Movie};
};

export type MovieDetailsScreenNavigationProp = DrawerNavigationProp<
    RootDrawerParamList,
    '(tabs)/MovieDetails'
>;

export type MovieDetailsScreenRouteProp = RouteProp<RootDrawerParamList, '(tabs)/MovieDetails'>;

export type Props = {
    navigation: MovieDetailsScreenNavigationProp;
    route: MovieDetailsScreenRouteProp;}
