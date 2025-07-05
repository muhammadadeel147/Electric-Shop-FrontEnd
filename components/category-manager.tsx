"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, ChevronRight,ChevronDown, Loader2, AlertCircle, ListTree, Table as TableIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import apiClient from "@/utils/apiClient"
import { useToast } from "@/hooks/use-toast"

// Define the category interface based on the backend model
interface Category {
  _id: string
  name: string
  description?: string
  parent: string | null
  children: Category[]
  totalProducts: number
  totalStockValue: number
}

// Interface for flattened category data
interface FlatCategory {
  _id: string
  name: string
  description?: string
  parent: string | null
  parentName?: string
  level: number
  totalProducts: number
  totalStockValue: number
  childCount: number
}

export function CategoryManager() {
  const [activeTab, setActiveTab] = useState("hierarchy")
  const [categories, setCategories] = useState<Category[]>([])
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  
  // Dialog states
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletingCategory, setIsDeletingCategory] = useState(false)
  
  // Form states
  const [categoryName, setCategoryName] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<{id: string, name: string} | null>(null)
  const [selectedParent, setSelectedParent] = useState<string | null>(null)
  
  const { toast } = useToast()

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Function to fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get("/categories")
      setCategories(response.data)
      
      // Flatten categories for table view
      const flattened = flattenCategories(response.data)
      setFlatCategories(flattened)
      
      setError(null)
    } catch (err: any) {
      setError("Failed to fetch categories")
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load categories",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to flatten the category hierarchy for table view
  const flattenCategories = (cats: Category[], parentName?: string, level = 0): FlatCategory[] => {
    let result: FlatCategory[] = []
    
    cats.forEach(cat => {
      result.push({
        _id: cat._id,
        name: cat.name,
        description: cat.description,
        parent: cat.parent,
        parentName: parentName,
        level: level,
        totalProducts: cat.totalProducts || 0,
        totalStockValue: cat.totalStockValue || 0,
        childCount: cat.children?.length || 0
      })
      
      if (cat.children && cat.children.length > 0) {
        result = [...result, ...flattenCategories(cat.children, cat.name, level + 1)]
      }
    })
    
    return result
  }

  // Function to add a new category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) return

    try {
      setIsSubmitting(true)
      await apiClient.post("/categories", {
        name: categoryName,
        description: categoryDescription || undefined,
        parent: selectedParent
      })
      
      toast({
        title: "Success",
        description: "Category created successfully"
      })
      
      resetForm()
      fetchCategories()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create category",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to update a category
  const handleUpdateCategory = async () => {
    if (!selectedCategory || !categoryName.trim()) return

    try {
      setIsSubmitting(true)
      await apiClient.put(`/categories/${selectedCategory}`, {
        name: categoryName,
        description: categoryDescription || undefined,
        parent: selectedParent
      })
      
      toast({
        title: "Success",
        description: "Category updated successfully"
      })
      
      resetForm()
      fetchCategories()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update category",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Open delete confirmation modal
  const openDeleteConfirmation = (category: Category | FlatCategory) => {
    setSelectedCategoryToDelete({ id: category._id, name: category.name })
    setDeleteError(null)
    setDeleteConfirmOpen(true)
  }

  // Function to delete a category
  const handleDeleteCategory = async () => {
    if (!selectedCategoryToDelete) return

    try {
      setIsDeletingCategory(true)
      setDeleteError(null)
      await apiClient.delete(`/categories/${selectedCategoryToDelete.id}`)
      
      toast({
        title: "Success",
        description: "Category deleted successfully"
      })
      
      // Close the dialog
      setDeleteConfirmOpen(false)
      setSelectedCategoryToDelete(null)
      
      // Refresh categories
      fetchCategories()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete category"
      setDeleteError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsDeletingCategory(false)
    }
  }
  
  // Reset form and dialog states
  const resetForm = () => {
    setCategoryName("")
    setCategoryDescription("")
    setSelectedCategory(null)
    setSelectedParent(null)
    setAddCategoryOpen(false)
    setEditCategoryOpen(false)
  }

  // Open dialog to add a subcategory
  const openAddSubcategory = (parentId: string) => {
    setSelectedParent(parentId)
    setCategoryName("")
    setCategoryDescription("")
    setAddCategoryOpen(true)
  }

  // Open dialog to edit a category
  const openEditCategory = (category: Category | FlatCategory) => {
    setSelectedCategory(category._id)
    setCategoryName(category.name)
    setCategoryDescription(category.description || "")
    setSelectedParent(category.parent)
    setEditCategoryOpen(true)
  }

  // Recursive function to render category hierarchy
  const renderCategoryItem = (category: Category, depth = 0) => (
    <AccordionItem key={category._id} value={`category-${category._id}`}>
      <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
        <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
        <div className="flex items-center justify-between w-full pr-4">
          <div className="font-medium">{category.name}</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{category.children?.length || 0} Subcategories</Badge>
            <Badge variant="outline">{category.totalProducts || 0} Products</Badge>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  openEditCategory(category)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  openDeleteConfirmation(category)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={(e) => {
                  e.stopPropagation()
                  openAddSubcategory(category._id)
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Subcategory
              </Button>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4">
        {category.children && category.children.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {category.children.map(child => renderCategoryItem(child, depth + 1))}
          </Accordion>
        ) : (
          <div className="py-2 text-muted-foreground">No subcategories</div>
        )}
      </AccordionContent>
    </AccordionItem>
  )

  // Function to get indent spacing for table view
  const getIndent = (level: number) => {
    return { paddingLeft: `${level * 24 + 16}px` }
  }
// Add this state to your component
const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(new Set())

// Add this function to toggle category expansion
const toggleCategoryExpansion = (categoryId: string, event: React.MouseEvent) => {
  event.stopPropagation()
  setExpandedCategoryIds(prev => {
    const newSet = new Set(prev)
    if (newSet.has(categoryId)) {
      newSet.delete(categoryId)
    } else {
      newSet.add(categoryId)
    }
    return newSet
  })
}

// Function to get filtered flat categories based on expansion state
const getVisibleCategories = () => {
  if (expandedCategoryIds.size === 0) {
    // If nothing is expanded, show only top-level categories
    return flatCategories.filter(cat => cat.level === 0)
  }
  
  // Start with top-level categories
  const result = flatCategories.filter(cat => cat.level === 0)
  
  // For each expanded category, add its direct children
  flatCategories.forEach(cat => {
    if (cat.parent && expandedCategoryIds.has(cat.parent)) {
      result.push(cat)
    }
  })
  
  return result
}
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Manage the hierarchical categories for your products.</CardDescription>
            </div>
            <Button onClick={() => {
              setSelectedParent(null)
              setAddCategoryOpen(true)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hierarchy" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-6 border-b">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="hierarchy" className="flex items-center gap-2">
                  <ListTree className="h-4 w-4" />
                  Hierarchy View
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <TableIcon className="h-4 w-4" />
                  Table View
                </TabsTrigger>
              </TabsList>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                {error}
              </div>
            ) : (
              <>
                <TabsContent value="hierarchy" className="mt-0">
                  {categories.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                      {categories.map(category => renderCategoryItem(category))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No categories found. Add your first category to get started.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="table" className="mt-0">
  {flatCategories.length > 0 ? (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead className="w-[20%]">Parent</TableHead>
            <TableHead className="text-center">Subcategories</TableHead>
            <TableHead className="text-center">Products</TableHead>
            <TableHead className="text-center">Stock Value</TableHead>
            <TableHead className="text-right w-[160px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getVisibleCategories().map((category) => (
            <TableRow key={category._id}>
              <TableCell style={getIndent(category.level)}>
                <div className="flex items-center">
                  {category.childCount > 0 ? (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-5 w-5 p-0 mr-1"
                      onClick={(e) => toggleCategoryExpansion(category._id, e)}
                    >
                      {expandedCategoryIds.has(category._id) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  ) : (
                    <div className="w-5 mr-1"></div>
                  )}
                  <span className="font-medium">{category.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {category.parentName || "-"}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{category.childCount}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{category.totalProducts}</Badge>
              </TableCell>
              <TableCell className="text-center">
                ${category.totalStockValue.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => openEditCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => openDeleteConfirmation(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => openAddSubcategory(category._id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <div className="text-center py-8 text-muted-foreground">
      No categories found. Add your first category to get started.
    </div>
  )}
</TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog open={addCategoryOpen || editCategoryOpen} onOpenChange={(open) => {
        if (!open) resetForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCategoryOpen ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editCategoryOpen 
                ? "Update the details of this category"
                : selectedParent
                  ? `Create a new subcategory under ${categories.find(c => c._id === selectedParent)?.name || "the selected category"}`
                  : "Create a new top-level category"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input 
                id="categoryName" 
                placeholder="e.g., Lighting, Wiring, Fans" 
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Description (Optional)</Label>
              <Textarea 
                id="categoryDescription" 
                placeholder="Brief description of this category" 
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={editCategoryOpen ? handleUpdateCategory : handleAddCategory}
              disabled={isSubmitting || !categoryName.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editCategoryOpen ? "Updating..." : "Adding..."}
                </>
              ) : (
                editCategoryOpen ? "Update Category" : "Add Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirmOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmOpen(false)
            setDeleteError(null)
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <DialogTitle>Delete Category</DialogTitle>
            </div>
            <DialogDescription className="pt-3">
              Are you sure you want to delete <span className="font-medium">{selectedCategoryToDelete?.name}</span>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deleteError ? (
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 mt-2">
              <div className="flex gap-2 items-start text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{deleteError}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-3">
              <p className="text-sm text-muted-foreground">
                Deleting this category will permanently remove it from the system. Make sure that:
              </p>
              <ul className="text-sm list-disc pl-5 text-muted-foreground space-y-1">
                <li>It doesn't have any products assigned to it</li>
                <li>It doesn't contain any subcategories</li>
              </ul>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false)
                setDeleteError(null)
              }}
              disabled={isDeletingCategory}
            >
              {deleteError ? "Close" : "Cancel"}
            </Button>
            {!deleteError && (
              <Button 
                variant="destructive" 
                onClick={handleDeleteCategory}
                disabled={isDeletingCategory}
              >
                {isDeletingCategory ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Category"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}