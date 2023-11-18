import {useEffect, useState} from 'react';
import Wretch from 'wretch';
import {secureStore} from '~/store/mmkv';
import {Ticket} from '~/types/ticket';
import {showErrorNotif} from '~/utils/notif';
const HOST = 'https://api.sqlplay.net';

const wretch = Wretch(`${HOST}`);

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
      const res = (await wretch.url('/ticket').post(body).json()) as {
        message: string;
      };
      setState({...state, data: res.message});
      return res;
    } catch (error) {
      let errMsg = String(error);
      if (error instanceof Error) {
        errMsg = error.message;
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
      const res = wretch
        .get(`/list-tickets/${transactionId}`)
        .notFound(() =>
          showErrorNotif(
            'No support tickets found',
            'Feel free to open one, we are here to help.',
          ),
        );

      const json = (await res.json()) as {tickets: Ticket[]};
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
  useEffect(() => {
    fetch();
  }, []);

  return {...state};
};
