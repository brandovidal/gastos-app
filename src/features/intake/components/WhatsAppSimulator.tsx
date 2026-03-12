import { useState } from "react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import { Send, Inbox, ArrowRight } from "lucide-react";
import { useAppStore } from "@/mocks/store";
import { parseWhatsAppMessage } from "../parsers/whatsapp.parser";
import { intakeItemSchema, type IntakeItem, type Classification } from "../intake.validator";
import { ClassificationDialog } from "./ClassificationDialog";
import { formatCurrency } from "@/shared/lib/currency";

interface Message {
  id: string;
  text: string;
  parsed: Partial<IntakeItem>;
  addedToInbox: boolean;
}

export function WhatsAppSimulator() {
  const addIntakeItem = useAppStore((s) => s.addIntakeItem);
  const classifyAndConfirmItem = useAppStore((s) => s.classifyAndConfirmItem);

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [classifyItem, setClassifyItem] = useState<IntakeItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const parsed = parseWhatsAppMessage(text);
    const msg: Message = {
      id: crypto.randomUUID(),
      text,
      parsed,
      addedToInbox: false,
    };
    setMessages((prev) => [...prev, msg]);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const createIntakeItem = (msg: Message): IntakeItem => {
    return intakeItemSchema.parse({
      ...msg.parsed,
      source: "whatsapp",
      sourceDocumentType: "whatsapp_text",
    });
  };

  const handleAddToInbox = (msgId: string) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg) return;

    const item = createIntakeItem(msg);
    addIntakeItem(item);
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, addedToInbox: true } : m));
  };

  const handleClassifyNow = (msgId: string) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg) return;

    const item = createIntakeItem(msg);
    addIntakeItem(item);
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, addedToInbox: true } : m));
    setClassifyItem(item);
    setDialogOpen(true);
  };

  const handleConfirmClassify = (classification: Classification) => {
    if (classifyItem) {
      classifyAndConfirmItem(classifyItem.id, classification);
      setDialogOpen(false);
      setClassifyItem(null);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="min-h-[400px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto mb-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                <Send className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">Escribe un gasto como lo harias en WhatsApp</p>
                <p className="text-xs mt-1 text-muted-foreground/70">Ejemplo: Luz 85.50 BCP</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                {/* User message bubble */}
                <div className="flex justify-end">
                  <div className="bg-green-600 text-white rounded-lg rounded-br-none px-3 py-2 max-w-[80%]">
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>

                {/* Parsed preview */}
                <div className="flex justify-start">
                  <Card className="max-w-[85%] border-dashed">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{msg.parsed.description}</span>
                        {msg.parsed.amount ? (
                          <Badge variant="outline">
                            {formatCurrency(msg.parsed.amount, msg.parsed.currency)}
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        {msg.parsed.date && <span>{msg.parsed.date}</span>}
                        {msg.parsed.account && <Badge variant="secondary" className="text-xs">{msg.parsed.account}</Badge>}
                        {msg.parsed.currency && <span>{msg.parsed.currency}</span>}
                      </div>

                      {!msg.addedToInbox ? (
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" variant="outline" onClick={() => handleAddToInbox(msg.id)}>
                            <Inbox className="mr-1 h-3 w-3" /> Bandeja
                          </Button>
                          <Button size="sm" onClick={() => handleClassifyNow(msg.id)}>
                            <ArrowRight className="mr-1 h-3 w-3" /> Clasificar
                          </Button>
                        </div>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Agregado
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Luz 85.50 BCP hoy"
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {classifyItem && (
        <ClassificationDialog
          item={classifyItem}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleConfirmClassify}
        />
      )}
    </div>
  );
}
