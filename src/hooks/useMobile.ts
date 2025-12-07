import { useEffect, useState } from "react"

export function useMobile() {
    const [isMobile, setisMobile] = useState(false)

    useEffect(() => {
        if (window.innerWidth < 768) {
            setisMobile(true)
        } else {
            setisMobile(false)
        }

    }, [isMobile])

    return {
        isMobile
    }
}