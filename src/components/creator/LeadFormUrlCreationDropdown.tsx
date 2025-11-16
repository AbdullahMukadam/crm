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
                <Button className="w-full bg-white text-black hover:bg-gray-100">
                    {selectedOption?.Label || "Options"}
                    <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="center">
                {LeadFormGenerationOptions.map((option : SelectedOption) => (
                    <DropdownMenuItem onClick={() => handleSelect(option)}>
                        {option.Label}
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
