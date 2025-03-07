export const sendEmail = async (email: string, subject: string, message: string) => {
  const response: Response = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, subject, message }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to send email");
  }
  return response.json();
};
