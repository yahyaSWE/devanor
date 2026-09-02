const CHATWOOT_BASE_URL = "https://chatwoot-rswkm-u77951.vm.elestio.app";

type SearchContact = { id: number; email?: string | null };

/** Best-effort sync: blocking applies to every inbox linked to the contact. */
export async function setChatwootContactsBlocked(
  emails: string[],
  blocked: boolean,
) {
  const accountId = Number(process.env.CHATWOOT_ACCOUNT_ID ?? "1");
  const apiToken = process.env.CHATWOOT_API_ACCESS_TOKEN;
  if (!apiToken || !emails.length) return;

  const uniqueEmails = [...new Set(emails.map((email) => email.toLowerCase()))];
  await Promise.allSettled(
    uniqueEmails.map(async (email) => {
      const search = await fetch(
        `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/search?q=${encodeURIComponent(email)}`,
        {
          headers: { api_access_token: apiToken },
          cache: "no-store",
        },
      );
      if (!search.ok) {
        throw new Error(`Chatwoot contact search failed (${search.status})`);
      }

      const data = (await search.json()) as { payload?: SearchContact[] };
      const contacts = (data.payload ?? []).filter(
        (contact) => contact.email?.toLowerCase() === email,
      );
      await Promise.all(
        contacts.map(async (contact) => {
          const response = await fetch(
            `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/${contact.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                api_access_token: apiToken,
              },
              body: JSON.stringify({ blocked }),
            },
          );
          if (!response.ok) {
            throw new Error(`Chatwoot contact update failed (${response.status})`);
          }
        }),
      );
    }),
  );
}
