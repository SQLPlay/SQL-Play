import {LessonItem} from './lesson-type';

export type RootStackParamList = {
  CodeRunner: undefined;
  Lesson: LessonItem;
  SupportedQuery: LessonItem;
  Learn: undefined;
  Purchase: undefined;
  Main: undefined;
  Export: undefined;
  SupportTicketsList: undefined;
  NewSupportTicket: undefined;
  SupportTicketDetails: {ticketId: string};
};

namespace ReactNavigation {
  interface RootParamList extends RootStackParamList {}
}
