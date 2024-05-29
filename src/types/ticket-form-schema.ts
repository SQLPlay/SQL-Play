import {
  email,
  minLength,
  maxLength,
  object,
  type Output,
  parse,
  string,
} from 'valibot';

const TicketFormSchema = object({
  email: string([email()]),
  // name: string([minLength(2), maxLength(50)]),
  message: string([minLength(20), maxLength(500)]),
});

export const parseTicketFormSchema = (value: unknown) => {
  return parse(TicketFormSchema, value, {abortEarly: true});
};
