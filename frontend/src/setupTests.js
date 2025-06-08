import '@testing-library/jest-dom';

// Define TextEncoder/TextDecoder para Jest
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
