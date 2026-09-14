// backend/src/system-settings/dto/update-system-settings.dto.ts
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateSystemSettingsDto {
    @IsOptional()
    @IsBoolean()
    isLoginEnabled?: boolean;

    @IsOptional()
    @IsBoolean()
    isSignupEnabled?: boolean;
}
