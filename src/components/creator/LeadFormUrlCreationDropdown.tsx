"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LeadFormGenerationOptions } from "@/config/settingsConfig"
import { ChevronDown } from "lucide-react"
import { useCallback } from "react"
import { SelectedOption } from "./branding.Client"

interface Props {
    handleSelect: (option: any) => void
    selectedOption: SelectedOption | null
}
export function LeadFormUrlCreationDropdown({ handleSelect, selectedOption }: Props) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-full justify-between gap-2">
                    {selectedOption?.Label || "Options"}
                    <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
                {LeadFormGenerationOptions.map((option : SelectedOption) => (
                    <DropdownMenuItem onClick={() => handleSelect(option)}>
                        {option.Label} 
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
