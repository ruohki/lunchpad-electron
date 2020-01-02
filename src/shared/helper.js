export const IPCErrorReply = (message, stack) => ({ success: false, message });
export const IPCReply = (payload) => ({ success: true, payload });