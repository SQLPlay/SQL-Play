import {useEffect, useState} from 'react';
import Wretch from 'wretch';
import {secureStore} from '~/store/mmkv';
import {Ticket} from '~/types/ticket';
import {showErrorNotif} from '~/utils/notif';
const HOST = 'https://api.sqlplay.net';

const api = Wretch(HOST).errorType('json');

type HookState<DataT> = {
  error: string | null;
  isLoading: boolean;
  data?: DataT;
};

export const useOpenTicketApi = () => {
  const [state, setState] = useState<HookState<string>>({
    error: null,
    isLoading: false,
  });

  const mutate = async (body: Record<string, unknown>) => {
    try {
      setState(prv => ({...prv, isLoading: true}));
      const res = (await api.url('/ticket').post(body).json()) as {
        message: string;
        ticketId: string;
      };
      setState({...state, data: res.message});
      return res;
    } catch (error) {
      let errMsg = String(error);
      if (error instanceof Wretch.WretchError) {
        errMsg = error.json.error;
        throw Error(errMsg);
      }
      setState(prv => ({...prv, error: errMsg}));
      throw error;
    } finally {
      setState(prv => ({...prv, isLoading: false}));
    }
  };

  return {mutate, ...state};
};

export const useAddResponseInTicket = (ticketId: string) => {
  const [state, setState] = useState<HookState<string>>({
    error: null,
    isLoading: false,
  });

  const mutate = async (message: string) => {
    try {
      setState(prv => ({...prv, isLoading: true}));
      const res = (await api
        .url(`/ticket/${ticketId}`)
        .post({message})
        .json()) as {
        message: string;
      };
      setState({...state, data: res.message});
      return res;
    } catch (error) {
      let errMsg = String(error);
      if (error instanceof Wretch.WretchError) {
        errMsg = error.json?.error ?? error.message;
        throw Error(errMsg);
      }
      setState(prv => ({...prv, error: errMsg}));
      throw error;
    } finally {
      setState(prv => ({...prv, isLoading: false}));
    }
  };

  return {mutate, ...state};
};

export const useListTicketsApi = () => {
  const [state, setState] = useState<HookState<Ticket[]>>({
    error: null,
    isLoading: false,
    data: [],
  });

  const fetch = async () => {
    try {
      setState(prv => ({...prv, isLoading: true}));
      const transactionId = await secureStore.getStringAsync('transactionId');
      const res = await api.get(`/list-tickets/${transactionId}`).json();

      const json = res as {tickets: Ticket[]};
      setState({...state, data: json.tickets});
    } catch (error) {
      let errMsg = String(error);
      if (error instanceof Wretch.WretchError) {
        errMsg = error.message;
      }
      setState(prv => ({...prv, error: errMsg}));
    } finally {
      setState(prv => ({...prv, isLoading: false}));
    }
  };

  return {...state, fetch};
};

export type TicketResponseMsg = {
  message: string;
  responder: string;
};

export type TicketResponses = {
  details: {
    ticketId: string;
    createdAt: string;
  };
  messages: TicketResponseMsg[];
};

export const useGetTicketResponsesApi = (ticketId: string) => {
  const [state, setState] = useState<HookState<TicketResponses | null>>({
    error: null,
    isLoading: false,
    data: null,
  });

  const fetch = async () => {
    try {
      setState(prv => ({...prv, isLoading: true}));
      const res = await api.get(`/ticket/${ticketId}`).json();

      const json = res as TicketResponses;
      setState({...state, data: json});
    } catch (error) {
      let errMsg = String(error);
      if (error instanceof Wretch.WretchError) {
        errMsg = error.message;
      }
      setState(prv => ({...prv, error: errMsg}));
    } finally {
      setState(prv => ({...prv, isLoading: false}));
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  return {...state};
};
