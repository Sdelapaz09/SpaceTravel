import "@testing-library/jest-dom";

/* This code is from Github issue https://github.com/ai/nanoid/issues/363, the comment https://github.com/ai/nanoid/issues/363#issuecomment-1458167176, taken on 07-21-2023 (UTC).

This code solves an error caused by the `nanoid` package which is used in the `/src/services/SpaceTravelMockApi.js` file.
*/

jest.mock("nanoid", () => {
    return {
        nanoid: () => {}
    };
});