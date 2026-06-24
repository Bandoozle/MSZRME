import type { Contact, Threads } from "@/lib/types";

export const CONTACTS: Contact[] = [
  { id: "TJ", name: "Tom",     role: "Your Coach",     initials: "TJ", color: "#00694A", online: true,  lastTime: "Tue 11:15 AM", preview: "Yes — you're at 142, Dealer A…", unread: 2 },
  { id: "SK", name: "Sarah K.", role: "Office Manager", initials: "SK", color: "#AF52DE", online: true,  lastTime: "Mon 2:24 PM",  preview: "Got it. I'll process end of day.", unread: 1 },
  { id: "MT", name: "Mike T.", role: "Lead Tech",       initials: "MT", color: "#FF9500", online: false, lastTime: "Today 3:50 PM",preview: "Get back to them today. Let …" },
];

export const THREADS: Threads = {
  TJ: [
    { me: false, text: "Your closing ratio jumped 4 points this month — what changed?", time: "Tue 8:30 AM" },
    { me: true,  text: "We added a 48-hour follow-up call on every estimate.",            time: "Tue 9:14 AM" },
    { me: false, text: "That compounds fast. Let's cover it in tonight's seminar.",        time: "Tue 9:20 AM" },
    { me: true,  text: "Looking forward to it. Should I push harder on service contracts?", time: "Tue 11:02 AM" },
    { me: false, text: "Yes — you're at 142, Dealer A has 187. That's a 45-contract gap worth ~$160K annually. Let's build a strategy.", time: "Tue 11:15 AM" },
  ],
  SK: [
    { me: false, text: "Hey, invoice #2281 for Burnaby job came in — approved?", time: "Mon 2:10 PM" },
    { me: true,  text: "Yes, approved. Thanks Sarah.",                            time: "Mon 2:22 PM" },
    { me: false, text: "Got it. I'll process end of day.",                        time: "Mon 2:24 PM" },
  ],
  MT: [
    { me: false, text: "Job on Lonsdale done. Callback on the Harrison install — their thermostat is reading wrong.", time: "Today 3:44 PM" },
    { me: true,  text: "Get back to them today. Let me know what you find.",                                          time: "Today 3:50 PM" },
  ],
};
