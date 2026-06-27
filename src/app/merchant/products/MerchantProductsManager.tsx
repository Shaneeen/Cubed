"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Folder,
  FolderPlus,
  ImageIcon,
  Info,
  PackagePlus,
  Plus,
  Tag,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/AuthContext";
import type { MerchantProduct, ProductCategory, ProductStatus } from "@/types/models";

const statusOptions: ProductStatus[] = ["draft", "active", "hidden", "sold_out"];

const emptyProductForm = {
  name: "",
  price: "",
  quantity: "1",
  description: "",
  status: "active" as ProductStatus,
  category_id: "",
};

async function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), 8000);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function MerchantProductsManager() {
  const { profile, loading: authLoading, error: authError } = useAuth();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<MerchantProduct[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>("all");
  const [categoryName, setCategoryName] = useState("");
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [draggedProductId, setDraggedProductId] = useState<string | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const [highlightedCategoryId, setHighlightedCategoryId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "info"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  function showNotice(type: "success" | "info", message: string) {
    setNotice({ type, message });
    window.setTimeout(() => {
      setNotice((current) => (current?.message === message ? null : current));
    }, 3600);
  }

  async function loadData() {
    if (!profile) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [categoryRes, productRes] = await withTimeout(
        Promise.all([
          supabase
            .from("product_categories")
            .select("*")
            .eq("merchant_id", profile.id)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true }),
          supabase
            .from("products")
            .select("*")
            .eq("merchant_id", profile.id)
            .order("created_at", { ascending: false }),
        ]),
        "Products are taking too long to load. Check your Supabase tables and connection."
      );

      if (categoryRes.error || productRes.error) {
        setError(
          categoryRes.error?.message ||
            productRes.error?.message ||
            "Unable to load products."
        );
        return;
      }

      setCategories(categoryRes.data ?? []);
      setProducts(productRes.data ?? []);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (profile) {
      void loadData();
    } else if (!authLoading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, authLoading]);

  useEffect(() => {
    if (!highlightedProductId && !highlightedCategoryId) return;

    const timeout = window.setTimeout(() => {
      setHighlightedProductId(null);
      setHighlightedCategoryId(null);
    }, 3600);

    return () => window.clearTimeout(timeout);
  }, [highlightedProductId, highlightedCategoryId]);

  async function createCategory(event: React.FormEvent) {
    event.preventDefault();
    if (!profile || !categoryName.trim()) return;

    setSaving(true);
    setError(null);

    const folderName = categoryName.trim();
    const { data: insertedCategory, error: insertError } = await supabase
      .from("product_categories")
      .insert({
        merchant_id: profile.id,
        name: folderName,
        sort_order: categories.length,
      })
      .select("*")
      .single();

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    setCategoryName("");
    setIsCategoryDialogOpen(false);
    setSaving(false);
    await loadData();
    setSelectedCategoryId(insertedCategory?.id ?? "all");
    setHighlightedCategoryId(insertedCategory?.id ?? null);
    showNotice("success", `Folder "${folderName}" created.`);
  }

  async function uploadProductImage(): Promise<string | null> {
    if (!profile || !imageFile) return null;

    const extension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${profile.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(fileName);

    return publicUrl;
  }

  async function createProduct(event: React.FormEvent) {
    event.preventDefault();
    if (!profile || !productForm.name.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const imageUrl = await uploadProductImage();
      const productName = productForm.name.trim();
      const { data: insertedProduct, error: insertError } = await supabase
        .from("products")
        .insert({
          merchant_id: profile.id,
          category_id: productForm.category_id || null,
          name: productName,
          image_url: imageUrl,
          price: Number(productForm.price || 0),
          quantity: Number(productForm.quantity || 0),
          description: productForm.description.trim() || null,
          status: productForm.status,
        })
        .select("*")
        .single();

      if (insertError) throw insertError;

      setProductForm(emptyProductForm);
      setImageFile(null);
      setIsProductDialogOpen(false);
      await loadData();
      setSelectedCategoryId(productForm.category_id || "all");
      setHighlightedProductId(insertedProduct?.id ?? null);
      showNotice("success", `"${productName}" added to your product library.`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create product.");
    } finally {
      setSaving(false);
    }
  }

  async function moveProduct(productId: string, categoryId: string | null) {
    const productName = products.find((product) => product.id === productId)?.name ?? "Product";
    const categoryName =
      categories.find((category) => category.id === categoryId)?.name ?? "No folder";

    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, category_id: categoryId } : product
      )
    );

    const { error: updateError } = await supabase
      .from("products")
      .update({ category_id: categoryId })
      .eq("id", productId);

    if (updateError) {
      setError(updateError.message);
      await loadData();
      return;
    }

    setSelectedCategoryId(categoryId ?? "all");
    setHighlightedProductId(productId);
    setHighlightedCategoryId(categoryId);
    setDragOverCategoryId(null);
    showNotice("success", `"${productName}" moved to ${categoryName}.`);
  }

  function productsForCategory(categoryId: string | null) {
    return products.filter((product) => product.category_id === categoryId).length;
  }

  const visibleProducts = products.filter((product) => {
    if (selectedCategoryId === "all") return true;
    return product.category_id === selectedCategoryId;
  });

  if (authLoading || loading) {
    return (
      <div className="rounded-xl border border-border bg-bg-elevated p-5 text-text-muted shadow-theme">
        Loading product library...
      </div>
    );
  }
  if (authError) return <p>{authError}</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div className="space-y-6">
      {notice && (
        <div
          className={
            notice.type === "success"
              ? "flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
              : "flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-text"
          }
        >
          {notice.type === "success" ? <CheckCircle2 size={18} /> : <Info size={18} />}
          <span>{notice.message}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="section-head">
          <p className="eyebrow">Products</p>
          <h1>Product Library</h1>
          <p className="section-copy">
            Your products and folders are saved in Supabase. Drag products into
            folders to register their category.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <button type="button" className="button-secondary">
                <FolderPlus size={16} />
                Create folder
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create folder</DialogTitle>
                <DialogDescription>
                  Name a folder like Pokemon, Handmade, or New Arrivals. Products
                  can be dragged into it later.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={createCategory} className="grid gap-3">
                <label className="grid gap-1.5 text-sm font-medium text-text-muted">
                  Folder name
                  <input
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-text outline-none focus:border-primary"
                    placeholder="e.g. Pokemon"
                  />
                </label>
                <button type="submit" className="button-primary" disabled={saving}>
                  <FolderPlus size={16} />
                  {saving ? "Creating..." : "Create folder"}
                </button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogTrigger asChild>
              <button type="button" className="button-primary">
                <PackagePlus size={16} />
                Add product
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create product</DialogTitle>
              <DialogDescription>
                Add the product details, upload an image, then choose a folder
                now or drag it later.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={createProduct} className="grid gap-5">
              <section className="grid gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  1. Product details
                </p>
                <label className="grid gap-1.5 text-sm font-medium text-text-muted">
                  Product name
                  <input
                    required
                    value={productForm.name}
                    onChange={(event) =>
                      setProductForm((current) => ({ ...current, name: event.target.value }))
                    }
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-text outline-none focus:border-primary"
                    placeholder="e.g. Charizard booster pack"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-text-muted">
                  Description
                  <textarea
                    value={productForm.description}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className="min-h-24 rounded-lg border border-border bg-surface px-3 py-2 text-text outline-none focus:border-primary"
                    placeholder="Condition, rarity, size, notes, pickup details..."
                  />
                </label>
              </section>

              <section className="grid gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  2. Product image
                </p>
                <label className="grid cursor-pointer justify-items-center gap-3 rounded-xl border border-dashed border-border bg-surface-soft p-6 text-center text-text-muted">
                  <Upload size={26} />
                  <span className="font-semibold text-text">
                    {imageFile ? imageFile.name : "Upload image"}
                  </span>
                  <span className="text-sm">
                    {imageFile ? "Image ready to upload." : "PNG, JPG, WebP or GIF. Max 5MB."}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="sr-only"
                    onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                  />
                </label>
              </section>

              <section className="grid gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  3. Price, stock, folder
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium text-text-muted">
                    Price
                    <input
                      required
                      min="0"
                      step="0.01"
                      type="number"
                      value={productForm.price}
                      onChange={(event) =>
                        setProductForm((current) => ({ ...current, price: event.target.value }))
                      }
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-text outline-none focus:border-primary"
                      placeholder="0.00"
                    />
                  </label>

                  <label className="grid gap-1.5 text-sm font-medium text-text-muted">
                    Quantity
                    <input
                      min="0"
                      type="number"
                      value={productForm.quantity}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          quantity: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-text outline-none focus:border-primary"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium text-text-muted">
                    Folder
                    <select
                      value={productForm.category_id}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          category_id: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-text outline-none focus:border-primary"
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5 text-sm font-medium text-text-muted">
                    Status
                    <select
                      value={productForm.status}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          status: event.target.value as ProductStatus,
                        }))
                      }
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-text outline-none focus:border-primary"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <button type="submit" className="button-primary" disabled={saving}>
                <Plus size={16} />
                {saving ? "Uploading and saving..." : "Create product"}
              </button>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <p>{error}</p>
          {error.includes("product_categories") && (
            <p className="mt-2 text-text-muted">
              Run the products/categories migration in Supabase, then refresh this page.
            </p>
          )}
        </div>
      )}

      {categories.length > 0 && (
        <section className="rounded-xl border border-border bg-bg-elevated p-5 shadow-theme backdrop-blur-2xl">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Folders</p>
              <h2 className="text-2xl font-semibold">Categories</h2>
            </div>
            {selectedCategoryId !== "all" && (
              <button
                type="button"
                className="button-secondary"
                onClick={() => setSelectedCategoryId("all")}
              >
                Show all products
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
            <CategoryDropCard
              key={category.id}
              active={selectedCategoryId === category.id}
              highlighted={highlightedCategoryId === category.id}
              draggingOver={dragOverCategoryId === category.id}
              label={category.name}
              count={productsForCategory(category.id)}
              onClick={() => setSelectedCategoryId(category.id)}
              onDropProduct={(productId) => moveProduct(productId, category.id)}
              onDragEnter={() => setDragOverCategoryId(category.id)}
              onDragLeave={() => setDragOverCategoryId(null)}
              onDragOver={(event) => event.preventDefault()}
            />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-border bg-bg-elevated p-5 shadow-theme backdrop-blur-2xl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Database</p>
            <h2 className="text-2xl font-semibold">
              {selectedCategoryId === "all"
                ? "Products"
                : categories.find((category) => category.id === selectedCategoryId)?.name ??
                  "Products"}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Showing {visibleProducts.length} of {products.length} products.
            </p>
          </div>
          <p className="text-sm text-text-muted">
            {categories.length > 0
              ? "Drag a product card into a folder above to set its category."
              : "Create folders when you need them. For now, all products stay in one library."}
          </p>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="grid justify-items-center gap-2 rounded-xl border border-dashed border-border p-10 text-center">
            <Tag size={28} className="text-text-muted" />
            <h3 className="text-lg font-semibold">No products here yet</h3>
            <p className="max-w-md text-sm text-text-muted">
              Add a product to start building your library.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={
                  categories.find((category) => category.id === product.category_id)?.name ??
                  "No folder"
                }
                isDragging={draggedProductId === product.id}
                highlighted={highlightedProductId === product.id}
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", product.id);
                  setDraggedProductId(product.id);
                }}
                onDragEnd={() => {
                  setDraggedProductId(null);
                  setDragOverCategoryId(null);
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProductCard({
  product,
  categoryName,
  isDragging,
  highlighted,
  onDragStart,
  onDragEnd,
}: {
  product: MerchantProduct;
  categoryName: string;
  isDragging: boolean;
  highlighted: boolean;
  onDragStart: React.DragEventHandler<HTMLElement>;
  onDragEnd: React.DragEventHandler<HTMLElement>;
}) {
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={
        isDragging
          ? "cursor-grabbing overflow-hidden rounded-xl border border-primary bg-surface opacity-60 shadow-theme"
          : highlighted
            ? "cursor-grab overflow-hidden rounded-xl border border-emerald-400 bg-emerald-400/10 shadow-theme ring-2 ring-emerald-400/30"
            : "cursor-grab overflow-hidden rounded-xl border border-border bg-surface shadow-theme"
      }
    >
      <div
        className="grid aspect-square place-items-center bg-surface-soft text-text-muted"
        style={
          product.image_url
            ? {
                backgroundImage: `url(${product.image_url})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }
            : undefined
        }
      >
        {!product.image_url && <ImageIcon size={28} />}
      </div>
      <div className="space-y-2 p-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-text">{product.name}</h3>
          <p className="text-sm font-bold text-text">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs text-text-muted">
          <span className="rounded-md border border-border px-2 py-1">
            Qty {product.quantity}
          </span>
          <span className="rounded-md border border-border px-2 py-1">
            {product.status.replace("_", " ")}
          </span>
          <span className="rounded-md border border-border px-2 py-1">{categoryName}</span>
        </div>
      </div>
    </article>
  );
}

function CategoryDropCard({
  active,
  highlighted,
  draggingOver,
  label,
  count,
  onClick,
  onDropProduct,
  onDragEnter,
  onDragLeave,
  onDragOver,
}: {
  active: boolean;
  highlighted?: boolean;
  draggingOver?: boolean;
  label: string;
  count: number;
  onClick: () => void;
  onDropProduct?: (productId: string) => void;
  onDragEnter?: React.DragEventHandler<HTMLButtonElement>;
  onDragLeave?: React.DragEventHandler<HTMLButtonElement>;
  onDragOver?: React.DragEventHandler<HTMLButtonElement>;
}) {
  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const productId = event.dataTransfer.getData("text/plain");
    if (productId && onDropProduct) onDropProduct(productId);
  }

  function handleDragOver(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    onDragOver?.(event);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={handleDragOver}
      className={
        draggingOver
          ? "relative z-30 grid size-[156px] gap-2 rounded-2xl border border-emerald-400 bg-emerald-400/15 p-4 text-left shadow-theme ring-2 ring-emerald-400/30"
          : highlighted
            ? "relative z-20 grid size-[156px] gap-2 rounded-2xl border border-emerald-400 bg-emerald-400/10 p-4 text-left shadow-theme"
            : active
              ? "relative z-20 grid size-[156px] gap-2 rounded-2xl border border-primary bg-surface p-4 text-left shadow-theme"
              : "relative z-20 grid size-[156px] gap-2 rounded-2xl border border-border bg-surface/70 p-4 text-left transition hover:border-primary hover:bg-surface"
      }
      onDrop={handleDrop}
    >
      <div className="pointer-events-none flex items-start justify-between gap-2">
        <Folder size={28} />
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-muted">
          {count}
        </span>
      </div>
      <div className="pointer-events-none min-w-0 self-end">
        <span className="line-clamp-2 block text-base font-semibold leading-tight text-text">
          {label}
        </span>
        <span className="text-sm text-text-muted">{count} products</span>
      </div>
    </button>
  );
}
