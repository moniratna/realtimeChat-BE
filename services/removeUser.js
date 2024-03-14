let users = [];

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);
	return users[index];
};
export default removeUser;
