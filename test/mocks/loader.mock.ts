
export const mockLoad = jest.fn();

const mockLoaderImpl = jest.fn().mockImplementation(() => {
	return {
		load: mockLoad
	};
});

export default mockLoaderImpl;