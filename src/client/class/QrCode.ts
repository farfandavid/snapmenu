import QRCodeStyling from "qr-code-styling";
import type { DrawType, IOptions, TypeNumber, Mode, ErrorCorrectionLevel, DotType, Gradient, CornerDotType, CornerSquareType } from "../types/Options";

export class QrCode implements IOptions {
    type?: DrawType;
    width?: number;
    height?: number;
    margin?: number;
    data?: string;
    image?: string;
    qrOptions?: {
        typeNumber?: TypeNumber;
        mode?: Mode;
        errorCorrectionLevel?: ErrorCorrectionLevel;
    };
    imageOptions: {
        hideBackgroundDots?: boolean;
        imageSize?: number;
        crossOrigin?: string;
        margin?: number;
    };
    dotsOptions?: {
        type?: DotType;
        color?: string;
        gradient?: Gradient;
    };
    cornersSquareOptions?: {
        type?: CornerSquareType;
        color?: string;
        gradient?: Gradient;
    };
    cornersDotOptions?: {
        type?: CornerDotType;
        color?: string;
        gradient?: Gradient;
    };
    backgroundOptions?: {
        color?: string;
        gradient?: Gradient;
    };

    constructor(options: IOptions) {
        this.type = options.type;
        this.width = options.width;
        this.height = options.height;
        this.margin = options.margin;
        this.data = options.data;
        this.image = options.image;
        this.qrOptions = options.qrOptions;
        this.imageOptions = options.imageOptions;
        this.dotsOptions = options.dotsOptions;
        this.cornersSquareOptions = options.cornersSquareOptions;
        this.cornersDotOptions = options.cornersDotOptions;
        this.backgroundOptions = options.backgroundOptions;
    }

    createQrCode() {
        return new QRCodeStyling({ ...this });
    }
}