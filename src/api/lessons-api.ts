import {useEffect, useState} from 'react';
import Wretch from 'wretch';
const HOST = 'https://assets.sqlplay.net';

const wretch = Wretch(`${HOST}`);

type LessonItem = {
  title: string;
  description: string;
  short_description: string;
  path: string;
};

type HookState<DataT> = {
  error: string | null;
  isLoading: boolean;
  data?: DataT;
};
export const useGetLessonsList = () => {
  const [state, setState] = useState<HookState<LessonItem[]>>({
    error: null,
    isLoading: true,
  });

  const fetch = async () => {
    try {
      const res = await wretch.get('/learn/lessons.json').json();
      setState({...state, data: res as LessonItem[]});
    } catch (error) {
      console.log(error);
    } finally {
      setState(prv => ({...prv, isLoading: false}));
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  return {...state};
};
