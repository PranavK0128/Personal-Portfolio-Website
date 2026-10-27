export type ContactValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (values.name.trim().length < 2 || values.name.length > 100)
    errors.name = "Enter a name between 2 and 100 characters.";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ||
    values.email.length > 254
  )
    errors.email = "Please enter a valid email address.";
  if (values.subject.trim().length < 5 || values.subject.length > 200)
    errors.subject = "Enter a subject between 5 and 200 characters.";
  if (values.message.trim().length < 10 || values.message.length > 5000)
    errors.message = "Enter a message between 10 and 5,000 characters.";
  return errors;
}

export async function submitContact(
  endpoint: string | undefined,
  values: ContactValues,
  fetcher: typeof fetch = fetch,
) {
  if (Object.keys(validateContact(values)).length)
    throw new Error("Please check the form fields.");
  if (
    !endpoint ||
    !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)
  ) {
    throw new Error(
      "The form is not available yet. Please email PranavK0128@gmail.com directly.",
    );
  }
  const response = await fetcher(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(
      Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value.trim()]),
      ),
    ),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    if (response.status === 429)
      throw new Error(
        "Too many attempts. Please try again later or email me directly.",
      );
    throw new Error(
      "Your message could not be sent. Please try again or email me directly.",
    );
  }
}
