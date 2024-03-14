const addUser = ({ id, name, room }) => {
	const users = [];
	if (!name || !room) return { error: "Username and room are required." };
	const user = { id, name, room };

	users.push(user);

	return { user };
};
export default addUser;
