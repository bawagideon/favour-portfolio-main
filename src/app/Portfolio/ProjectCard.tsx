"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { Project } from "../../Types/portfolio"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
  onProjectClick: (project: Project) => void
  index: number
}

export function ProjectCard({ project, onProjectClick, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      onClick={() => onProjectClick(project)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative aspect-[4/3] rounded-2xl overflow-hidden",
          "bg-background-light dark:bg-background-darker",
          "shadow-lg hover:shadow-2xl",
          "transition-all duration-500",
          "border border-border-light dark:border-border-dark",
        )}
      >
        {/* Project Image */}
        <Image
          src={project.images[0].src || "/placeholder.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn("object-cover transition-transform duration-500", "group-hover:scale-110")}
        />

        {/* Hover Overlay */}
        <motion.div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-r from-primary via-pink-500 to-purple-600",
            "flex items-center justify-center",
            "backdrop-blur-sm"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.95 : 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.h3
            className={cn(
              "text-2xl lg:text-3xl font-extrabold",
              "bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500",
              "text-center px-6 tracking-wide drop-shadow-lg"
            )}
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isHovered ? 0 : 20,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {project.title}
          </motion.h3>
        </motion.div>

        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent"
          animate={{
            borderColor: isHovered ? "rgba(255, 105, 180, 0.7)" : "rgba(0,0,0,0)",
            boxShadow: isHovered
              ? "0px 0px 20px rgba(255,105,180,0.6)"
              : "0px 0px 0px rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  )
}
